import {
  MissionModel,
  CardBoxModel,
  Card,
  CardModel,
  CardBox,
} from "@/Models/MissionModel";
import { ErrorVo } from "@/Vo/BaseVo";
import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import { Socket } from "socket.io";
import { DocumentType } from "@typegoose/typegoose";

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
    sendByMId(ws, "getMission", mission);
  },
};

const addCard2: ioListener = {
  url: "/addCard",
  func: async (ws, payload: { boxId: string; cardName: string }) => {
    const { boxId, cardName } = payload;
    const box = await CardBoxModel.findOne({ _id: boxId });
    await box.addCard(cardName);
    await box.populate("cards");
    sendByMId(ws, "getCardBox", box);
    ws.emit("message", "success");
  },
};

const changeCard2: ioListener = {
  url: "/changeCard",
  func: async (ws, reqCard: DocumentType<Card>) => {
    console.log(reqCard);
    const card = await CardModel.findById(reqCard._id);
    if (!card) {
      throw new ErrorVo("查無資料");
    }
    Object.assign(card, reqCard);
    await card.save();
    sendByMId(ws, "getCard", card);
  },
};
const changeIndex: ioListener = {
  url: "/changeIndex",
  func: async (ws, reqCardBox: DocumentType<CardBox>) => {
    const { _id, cards } = reqCardBox;
    const cardBox = await CardBoxModel.findOne({ _id: _id });
    cardBox.cards = cards;
    await cardBox.save();
    await cardBox.populate("cards");

    sendByMId(ws, "getCardBox", cardBox);
  },
};
const sendByMId = (socket: Socket, event: string, ...obj: any[]) => {
  let room: string;
  socket.rooms.forEach((r) => {
    if (r.startsWith("Mission")) {
      room = r;
    }
  });
  socket.to(room).emit(event, ...obj);
  socket.emit(event, ...obj);
};

export const ioDemo = (
  ws: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  const baseUrl = "/mission";
  let mId = null;
  ws.on("setMid", (id) => {
    mId = id;
  });
  ws.on("broadcastByMid", (event, ...payload: any[]) => {
    ws.to("Mission." + mId).emit(event, ...payload);
    ws.emit(event, ...payload);
  });

  listeners.map((r) => {
    ws.on(baseUrl + r.url, async (...args) => {
      try {
        await r.func(ws, ...args);
      } catch (error) {
        console.log("error");
        if (error instanceof String) {
          ws.emit("message", error);
          return;
        }
        ws.emit("error", ErrorVo.convert(error));
      }
    });
  });
};

const listeners: ioListener[] = [
  joinRoom,
  getMission,
  addCard2,
  changeCard2,
  changeIndex,
];
