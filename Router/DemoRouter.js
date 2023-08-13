"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MissionModel_1 = require("../Models/MissionModel");
const BaseVo_1 = require("../Vo/BaseVo");
const UserModel_1 = require("../Models/UserModel");
const router = (0, express_1.Router)();
router.post("/newMission", async (req, res) => {
    const { user, mission } = req.body;
    console.log(mission);
    const newMiss = new MissionModel_1.MissionModel();
    newMiss.name = mission.name;
    newMiss.owner = user.id;
    await MissionModel_1.MissionModel.create(newMiss);
    res.send(newMiss);
});
router.post("/changeIndex", async (req, res) => {
    const body = req.body;
    const cardBox = await MissionModel_1.CardBoxModel.findOne({ _id: body._id });
    cardBox.cards = body.cards;
    await cardBox.save();
    res.send(cardBox);
});
router.get("/cardBox", async (req, res) => {
    const cardBox = await MissionModel_1.CardBoxModel.findOne({ _id: req.query.id });
    res.send(await cardBox.populate("cards"));
    // res.send(req.query.id);
});
router.get("/mission", async (req, res, next) => {
    const user = req.body.user;
    try {
        const defaultMission = await MissionModel_1.MissionModel.findOne();
        if (!defaultMission.editor.includes(user._id)) {
            defaultMission.editor.push(user);
            // console.log(await defaultMission.populate("editor"));
            await defaultMission.save();
        }
        const mission = await MissionModel_1.MissionModel.findByUserId(user._id);
        res.send(mission);
    }
    catch (error) {
        next(error);
    }
});
router.delete("/mission", async (req, res, next) => {
    try {
        const user = req.body.user;
        const { id } = req.query;
        const mission = await MissionModel_1.MissionModel.findOne({ _id: id });
        const user1 = await UserModel_1.UserModel.findOne({ _id: user._id });
        if (mission.owner == user1.id) {
            console.log("mission");
            await MissionModel_1.MissionModel.deleteOne({ _id: id });
            res.send(new BaseVo_1.BaseVo("刪除成功"));
        }
    }
    catch (error) {
        next(error);
    }
});
router.put("/card", async (req, res) => {
    const body = req.body;
    const cardBox = await MissionModel_1.CardBoxModel.findOne({ _id: body._id });
    cardBox.addCard(body.cardName);
    res.send(cardBox);
});
router.get("/test", (req, res) => {
    res.send("test");
});
exports.default = router;
//# sourceMappingURL=DemoRouter.js.map