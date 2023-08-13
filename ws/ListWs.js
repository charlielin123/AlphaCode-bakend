"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MissionModel_1 = require("../Models/MissionModel");
const UserTokenUtils_1 = require("../tools/UserTokenUtils");
const UserModel_1 = require("../Models/UserModel");
const BaseVo_1 = require("../Vo/BaseVo");
const todo_1 = require("../class/todo");
const express_1 = require("express");
const node_events_1 = require("node:events");
const wsList = {
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
                }
                else {
                    return {
                        done: true,
                    };
                }
            },
        };
    },
};
const router = (0, express_1.Router)();
exports.default = () => router.ws("/ws2", async (ws, req) => {
    ws = upgrade(ws);
    const { missionId } = req.query;
    let user = await wsWrap(ws, getUserByWs);
    if (!user)
        return;
    const wsId = (0, todo_1.uuid)();
    wsList[user.id] = {
        ws,
        missionId: missionId,
    };
    let mission = await wsWrap(ws, findMissionByIdAndUser, missionId, user);
    if (!mission)
        return;
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
    ws.on("addCardBox", async ({ boxName }) => {
        wsWrap(ws, addCardBox, boxName, mission);
    });
    ws.on("close", () => {
        if (wsList[user?.id]) {
            delete wsList[user.id];
        }
    });
});
const event1 = new node_events_1.EventEmitter();
const wsWrap = async (ws, func, ...args) => {
    try {
        return await func(ws, ...args);
    }
    catch (error) {
        ws.emit("error", error);
    }
};
const changeCard = async (ws, reqCard) => {
    const card = await MissionModel_1.CardModel.findById(reqCard.id);
    if (!card) {
        throw new BaseVo_1.ErrorVo("查無資料");
    }
    Object.assign(card, reqCard);
    await card.save();
};
const findMissionByIdAndUser = async (ws, missionId, user) => {
    let mission = await MissionModel_1.MissionModel.findOne({ _id: missionId });
    await mission.populate({
        path: "cardBoxes",
        populate: { path: "cards" },
    });
    if (!mission) {
        ws.emit("error", new BaseVo_1.ErrorVo("查無資料"));
        ws.close();
    }
    if (!user._id.equals(mission?.owner?._id) &&
        !mission.editor.includes(user._id)) {
        ws.emit("error", new BaseVo_1.ErrorVo("權限不足"));
        ws.close();
    }
    return mission;
};
const addCard = async (ws, payload, missionId) => {
    const { boxId, cardName } = payload;
    const box = await MissionModel_1.CardBoxModel.findOne({ _id: boxId });
    await box.addCard(cardName);
    await box.populate("cards");
    sendByMId(missionId, "cardChange", box);
};
const upgrade = (ws) => {
    ws.sendJson = sendJson;
    ws.emit2 = emit2;
    ws.on("error", (error) => {
        ws.emit2("error", error);
    });
    ws.on("message", (data) => {
        const { event, payload } = JSON.parse(data);
        ws.emit(event, payload);
    });
    return ws;
};
const changeIndex = async (ws, reqCardBox, mission) => {
    const { _id, cards } = reqCardBox;
    const cardBox = await MissionModel_1.CardBoxModel.findOne({ _id: _id });
    cardBox.cards = cards;
    await cardBox.save();
    await cardBox.populate("cards");
    sendByMId(mission.id, "cardChange", cardBox);
};
const addCardBox = async (ws, boxName, mission) => {
    await mission.addCardBox(boxName);
    await mission.populate({ path: "cardBoxes", populate: { path: "cards" } });
    sendByMId(mission.id, "addCardBox", mission);
};
const getUserByWs = async (ws) => {
    try {
        const protocol = ws.protocol;
        const token = decodeURI(protocol);
        const payload = (0, UserTokenUtils_1.decodedToken)(token);
        const user = await UserModel_1.UserModel.findOne({ email: payload?._doc.email });
        return user;
    }
    catch (error) {
        ws.emit("error", new BaseVo_1.LoginError("登入異常"));
        ws.close();
    }
};
function sendJson(obj) {
    // console.log("sendJson",obj);
    const objStr = JSON.stringify(obj);
    this.send(objStr);
}
function emit2(event, payload) {
    this.sendJson({
        event,
        payload,
    });
}
const sendByMId = (mId, event, payload) => {
    for (const wsObj of wsList) {
        if (wsObj.missionId == mId) {
            wsObj.ws.emit2(event, payload);
        }
    }
};
//# sourceMappingURL=ListWs.js.map