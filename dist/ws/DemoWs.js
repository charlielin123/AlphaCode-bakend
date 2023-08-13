"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioDemo = void 0;
const MissionModel_1 = require("../Models/MissionModel");
const BaseVo_1 = require("../Vo/BaseVo");
const joinRoom = {
    url: "/joinRoom",
    func: async (ws, mId) => {
        const room = "Mission." + mId;
        console.log(room);
        ws.rooms.forEach((r) => {
            if (r.startsWith("Mission"))
                ws.leave(r);
        });
        ws.join(room);
        let mission = await MissionModel_1.MissionModel.findOne({ _id: mId });
        await mission.populate({
            path: "cardBoxes",
            populate: { path: "cards" },
        });
        if (!mission) {
            ws.emit("error", new BaseVo_1.ErrorVo("查無資料"));
        }
        ws.emit("getMission", mission);
    },
};
const getMission = {
    url: "/getMission",
    async func(ws, mId) {
        const room = "Mission." + mId;
        let mission = await MissionModel_1.MissionModel.findOne({ _id: mId });
        await mission.populate({
            path: "cardBoxes",
            populate: { path: "cards" },
        });
        if (!mission) {
            throw new BaseVo_1.ErrorVo("查無資料");
        }
        sendByMId(ws, "getMission", mission);
    },
};
const addCard2 = {
    url: "/addCard",
    func: async (ws, payload) => {
        const { boxId, cardName } = payload;
        const box = await MissionModel_1.CardBoxModel.findOne({ _id: boxId });
        await box.addCard(cardName);
        await box.populate("cards");
        sendByMId(ws, "getCardBox", box);
        ws.emit("message", "success");
    },
};
const addCardBox = {
    url: "/addCardBox",
    func: async (ws, payload) => {
        const { mId, boxName } = payload;
        const mission = await MissionModel_1.MissionModel.findOne({ _id: mId });
        await mission.addCardBox(boxName);
        await mission.populate({ path: "cardBoxes", populate: { path: "cards" } });
        sendByMId(ws, "getMission", mission);
        ws.emit("getMission", mission);
    },
};
const changeCard2 = {
    url: "/changeCard",
    func: async (ws, reqCard) => {
        console.log(reqCard);
        const card = await MissionModel_1.CardModel.findById(reqCard._id);
        if (!card) {
            throw new BaseVo_1.ErrorVo("查無資料");
        }
        Object.assign(card, reqCard);
        await card.save();
        sendByMId(ws, "getCard", card);
    },
};
const changeIndex = {
    url: "/changeIndex",
    func: async (ws, reqCardBox) => {
        const { _id, cards } = reqCardBox;
        const cardBox = await MissionModel_1.CardBoxModel.findOne({ _id: _id });
        cardBox.cards = cards;
        await cardBox.save();
        await cardBox.populate("cards");
        sendByMId(ws, "getCardBox", cardBox);
    },
};
const sendByMId = (socket, event, ...obj) => {
    let room;
    socket.rooms.forEach((r) => {
        if (r.startsWith("Mission")) {
            room = r;
        }
    });
    socket.to(room).emit(event, ...obj);
    socket.emit(event, ...obj);
};
const ioDemo = (ws) => {
    const baseUrl = "/mission";
    listeners.map((r) => {
        ws.on(baseUrl + r.url, async (...args) => {
            try {
                await r.func(ws, ...args);
            }
            catch (error) {
                console.log("error");
                if (error instanceof String) {
                    ws.emit("message", error);
                    return;
                }
                ws.emit("error", BaseVo_1.ErrorVo.convert(error));
            }
        });
    });
};
exports.ioDemo = ioDemo;
const listeners = [
    joinRoom,
    getMission,
    addCard2,
    changeCard2,
    changeIndex,
    addCardBox
];
//# sourceMappingURL=DemoWs.js.map