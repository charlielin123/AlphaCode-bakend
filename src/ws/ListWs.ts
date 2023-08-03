import { CardBoxModel, Mission, MissionModel } from "@/Models/MissionModel";
import expressWs from "express-ws";
import ws from "ws";
import { decodedToken } from "../tools/UserTokenUtils";
import { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../Models/UserModel";
import { ErrorVo, LoginError } from "@/Vo/BaseVo";
import { uuid } from "@/class/todo";
import { DocumentType } from "@typegoose/typegoose";

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

export default function (expressWs: expressWs.Instance) {
  expressWs.app.ws("/ws2", async (ws: WebSocket2, req) => {
    const { missionId } = req.query;
    ws.sendJson = sendJson;
    ws.emit2 = emit2;
    let user: { _id: import("mongoose").Types.ObjectId };
    const wsId = uuid();
    let mission: DocumentType<Mission>;
    wsList[wsId] = {
      ws,
      missionId: missionId as string,
    };
    try {
      const protocol = ws.protocol;
      const token = decodeURI(protocol);
      const payload = decodedToken(token) as JwtPayload;
      user = await UserModel.findOne({ email: payload?._doc.email });
      mission = await MissionModel.findOne({ _id: missionId });
      await mission.populate({
        path: "cardBoxes",
        populate: { path: "cards" },
      });
      if (!mission) {
        ws.sendJson(new ErrorVo("查無資料"));
        ws.close();
      }
      if (
        !user._id.equals(mission?.owner?._id) &&
        !mission.editor.includes(user._id)
      ) {
        ws.sendJson(new ErrorVo("權限不足"));
        ws.close();
      }
      ws.emit2("getMission", mission);
    } catch (error) {
      console.log(error);
      ws.sendJson(new LoginError("登入異常"));
      ws.close();
    }

    ws.on("message", (data: string) => {
      console.log("message");
      const { event, payload } = JSON.parse(data);
      ws.emit(event, payload);
    });

    ws.on("listChange", async (obj) => {
      console.log("listChange");
      const cardBox = await CardBoxModel.findOne({ _id: obj._id });
      cardBox.cards = obj.cards;
      await cardBox.save();
      // sendByMId(missionId as string, cardBox);
    });

    ws.on("addCard", async (payload) => {
      try {
        const { boxId, cardName } = payload;
        const box = await CardBoxModel.findOne({ _id: boxId });
        await box.addCard(cardName);
        await box.populate("cards");
        sendByMId(missionId as string, "cardChange", box);
      } catch (error) {
        console.log(error);
      }
    });
    ws.on("changeIndex", async (payload) => {
      console.log("changeIndex", payload);
      const { _id, cards } = payload;
      try {
        const cardBox = await CardBoxModel.findOne({ _id: _id });
        cardBox.cards = cards;
        await cardBox.save()
        await cardBox.populate("cards");
        sendByMId(missionId as string, "cardChange", cardBox);
        
      } catch (error) {
        console.log(error)
      }
    });

    ws.on("addCardBox", async (payload: { boxName: string }) => {
      console.log("addCardBox", payload.boxName);
      try {
        await mission.addCardBox(payload.boxName);
        await mission.populate("cardBoxes");
        // console.log(mission);
        sendByMId(missionId as string, "addCardBox", mission);
      } catch (error) {
        console.log(error);
        return;
      }
    });

    ws.on("close", () => {
      delete wsList[wsId];
    });
  });
}
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
  console.log(payload);
  for (const wsObj of wsList) {
    if (wsObj.missionId == mId) {
      wsObj.ws.emit2(event, payload);
    }
  }
};
