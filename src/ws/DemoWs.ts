import {
  MissionModel,
  CardBoxModel,
  Card,
  CardModel,
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
    ws.emit("getMission", mission);
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
export const ioDemo = (
  ws: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  const baseUrl = "/mission";
  list2.map((l) => {
    ws.on(baseUrl + l.url, async (...args) => {
      try {
        await l.func(ws, ...args);
      } catch (error) {
        console.log("error");
        ws.emit("error", ErrorVo.convert(error));
      }
    });
  });
};

const list2: ioListener[] = [joinRoom, getMission, addCard2, changeCard2];
