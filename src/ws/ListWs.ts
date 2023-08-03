import {
  Card,
  CardBox,
  CardBoxModel,
  CardModel,
  Mission,
  MissionModel,
} from "@/Models/MissionModel";
import expressWs from "express-ws";
import ws from "ws";
import { decodedToken } from "../tools/UserTokenUtils";
import { JwtPayload } from "jsonwebtoken";
import { User, UserModel } from "../Models/UserModel";
import { ErrorVo, LoginError } from "@/Vo/BaseVo";
import { uuid } from "@/class/todo";
import { DocumentType } from "@typegoose/typegoose";
import { Router } from "express";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import { EventEmitter } from "node:events";

const wsList: {
  [prop: string]: { ws: WebSocket2; missionId: string };
  [Symbol.iterator]();
} = {
  [Symbol.iterator]() {
    const keys = Object.keys(this);
    let index = 0;
    return {
      next: () => {
        if (index < keys.length) {
          const key = keys[index];
          index++;
          return {
            value: this[key],
            done: false,
          };
        } else {
          return {
            done: true,
          };
        }
      },
    };
  },
};
const router = Router();

export default () =>
  router.ws("/ws2", async (ws: WebSocket2, req) => {
    ws = upgrade(ws);
    const { missionId } = req.query;
    let user: DocumentType<User> = await wsWrap(ws, getUserByWs);
    if (!user) return;
    const wsId = uuid();
    wsList[user.id] = {
      ws,
      missionId: missionId as string,
    };
    let mission = await wsWrap(ws, findMissionByIdAndUser, missionId, user);
    if (!mission) return;
    ws.emit2("getMission", mission);

    ws.on("addCard", async (payload) => {
      wsWrap(ws, addCard, payload, mission.id);
    });

    ws.on("changeIndex", async (payload) => {
      await wsWrap(ws, changeIndex, payload, mission);
    });

    ws.on("changeCard", async (payload) => {
      wsWrap(ws, changeCard, payload, mission);
    });

    ws.on("addCardBox", async ({ boxName }: { boxName: string }) => {
      wsWrap(ws, addCardBox, boxName, mission);
    });
    ws.on("close", () => {
      if (wsList[user?.id]) {
        delete wsList[user.id];
      }
    });
  });

type ioListener = {
  url: string;
  func: (
    ws: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    ...args: any[]
  ) => unknown;
};
const joinRoom: ioListener = {
  url: "/joinRoom",
  func: async (ws, mId: string) => {
    const room = "Mission." + mId;
    console.log(room);
    ws.rooms.forEach((r) => {
      if (r.startsWith("Mission")) ws.leave(r);
    });
    ws.join(room);
    let mission = await MissionModel.findOne({ _id: mId });
    await mission.populate({
      path: "cardBoxes",
      populate: { path: "cards" },
    });
    if (!mission) {
      ws.emit("error", new ErrorVo("查無資料"));
    }
    // ws.emit("getMission", mission);
    ws.to(room).emit("getMission", mission);
    ws.emit("getMission", mission);
  },
};
const getMission: ioListener = {
  url: "/getMission",
  async func(ws, mId: string) {
    const room = "Mission." + mId;
    let mission = await MissionModel.findOne({ _id: mId });
    await mission.populate({
      path: "cardBoxes",
      populate: { path: "cards" },
    });
    if (!mission) {
      throw new ErrorVo("查無資料");
    }
    ws.to(room).emit("getMission", mission);
  },
};

const addCard2: ioListener = {
  url: "/addCard",
  func: async (ws, payload: { boxId: string; cardName: string }) => {
    const { boxId, cardName } = payload;
    const box = await CardBoxModel.findOne({ _id: boxId });
    await box.addCard(cardName);
    await box.populate("cards");
    ws.to("Mission." + box.mission).emit("getCard", box);
    ws.emit("getCard", box);
  },
};

const changeCard2: ioListener = {
  url: "/changeCard",
  func: async (ws, reqCard: DocumentType<Card>) => {
    const card = await CardModel.findById(reqCard.id);
    if (!card) {
      throw new ErrorVo("查無資料");
    }
    Object.assign(card, reqCard);
    await card.save();
    ws.broadcast.emit("getCard", card);
    ws.emit("getCard", card);
  },
};

const list2: ioListener[] = [joinRoom, getMission, addCard2, changeCard2];
const event1 = new EventEmitter();
export const ioDemo = (
  ws: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  const baseUrl = "/mission";
  list2.map((l) => {
    ws.on(baseUrl + l.url, async (...args) => {
      try {
        await l.func(ws, ...args);
      } catch (error) {
        ws.emit("error", ErrorVo.convert(error));
      }
    });
  });
  console.log(ws.request.headers);
};

const wsWrap = async (
  ws: WebSocket2,
  func: Function,
  ...args: Array<unknown>
) => {
  try {
    return await func(ws, ...args);
  } catch (error) {
    ws.emit("error", error);
  }
};

const changeCard = async (ws: WebSocket2, reqCard: DocumentType<Card>) => {
  const card = await CardModel.findById(reqCard.id);
  if (!card) {
    throw new ErrorVo("查無資料");
  }
  Object.assign(card, reqCard);
  await card.save();
};

const findMissionByIdAndUser = async (
  ws: WebSocket2,
  missionId: string,
  user: DocumentType<User>
) => {
  let mission = await MissionModel.findOne({ _id: missionId });
  await mission.populate({
    path: "cardBoxes",
    populate: { path: "cards" },
  });
  if (!mission) {
    ws.emit("error", new ErrorVo("查無資料"));
    ws.close();
  }
  if (
    !user._id.equals(mission?.owner?._id) &&
    !mission.editor.includes(user._id)
  ) {
    ws.emit("error", new ErrorVo("權限不足"));
    ws.close();
  }
  return mission;
};

const addCard = async (
  ws: WebSocket2,
  payload: { boxId: string; cardName: string },
  missionId: string
) => {
  const { boxId, cardName } = payload;
  const box = await CardBoxModel.findOne({ _id: boxId });
  await box.addCard(cardName);
  await box.populate("cards");
  sendByMId(missionId, "cardChange", box);
};

const upgrade = (ws: WebSocket2) => {
  ws.sendJson = sendJson;
  ws.emit2 = emit2;
  ws.on("error", (error) => {
    ws.emit2("error", error);
  });
  ws.on("message", (data: string) => {
    const { event, payload } = JSON.parse(data);
    ws.emit(event, payload);
  });

  return ws;
};
const changeIndex = async (
  ws: WebSocket2,
  reqCardBox: DocumentType<CardBox>,
  mission: DocumentType<Mission>
) => {
  const { _id, cards } = reqCardBox;
  const cardBox = await CardBoxModel.findOne({ _id: _id });
  cardBox.cards = cards;
  await cardBox.save();
  await cardBox.populate("cards");
  sendByMId(mission.id as string, "cardChange", cardBox);
};
const addCardBox = async (
  ws: WebSocket2,
  boxName: string,
  mission: DocumentType<Mission>
) => {
  await mission.addCardBox(boxName);
  await mission.populate({ path: "cardBoxes", populate: { path: "cards" } });
  sendByMId(mission.id as string, "addCardBox", mission);
};

const getUserByWs = async (ws: WebSocket2) => {
  try {
    const protocol = ws.protocol;
    const token = decodeURI(protocol);
    const payload = decodedToken(token) as JwtPayload;
    const user = await UserModel.findOne({ email: payload?._doc.email });
    return user;
  } catch (error) {
    ws.emit("error", new LoginError("登入異常"));
    ws.close();
  }
};

interface WebSocket2 extends ws {
  sendJson?: (obj: object) => void;
  emit2?: (this: WebSocket2, event: string, payload: object) => void;
}
function sendJson(this: WebSocket2, obj: object) {
  // console.log("sendJson",obj);
  const objStr = JSON.stringify(obj);
  this.send(objStr);
}
function emit2(this: WebSocket2, event: string, payload: object) {
  this.sendJson({
    event,
    payload,
  });
}

const sendByMId = (mId: string, event: string, payload: object) => {
  for (const wsObj of wsList) {
    if (wsObj.missionId == mId) {
      wsObj.ws.emit2(event, payload);
    }
  }
};
