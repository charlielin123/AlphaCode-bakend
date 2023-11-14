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
import { RoomModel } from "@/Models/Message";
import { UserModel } from "@/Models/UserModel";

type ioListener = {
  url: string;
  func: (
    ws: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    ...args: any[]
  ) => unknown;
};
const joinRoom: ioListener = {
  url: "/joinRoom",
  func: async (ws) => {
    const room = "user." + ws.data.user._id;
    ws.join(room);
  },
};

const sendMsg: ioListener = {
  url: "/sendMsg",
  func: async (ws, payload: { msg: string }) => {
    // const room = "user." + ws.data.user._id;
    // ws.to(room).emit("message", payload.msg);
  },
}

const addChatRoom: ioListener = {
  url: "/addChatRoom",
  func: async (ws, payload: { userId: string; }) => {
    const newRoom = new RoomModel();
    newRoom.owner = ws.data.user;
    const to = await UserModel.findById(payload.userId);
    newRoom.users.push(to);
    await newRoom.save();
    ws.emit("addChatRoom", newRoom);

  }
}


export const ioDemo = (ws: Socket) => {
  const baseUrl = "/chat";
  
  
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
];
