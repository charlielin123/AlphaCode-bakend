import { Router } from "express";
import { MissionModel, CardBoxModel } from "@/Models/MissionModel";
import { BaseVo, ErrorVo } from "@/Vo/BaseVo";
import { UserModel } from "@/Models/UserModel";

const router = Router();

router.post("/newMission", async (req, res) => {
  const { user, mission } = req.body;
  console.log(mission);
  const newMiss = new MissionModel();
  newMiss.name = mission.name;
  newMiss.owner = user.id;
  await MissionModel.create(newMiss);
  res.send(newMiss);
});
router.post("/changeIndex", async (req, res) => {
  const body = req.body;
  const cardBox = await CardBoxModel.findOne({ _id: body._id });
  cardBox.cards = body.cards;
  await cardBox.save();
  res.send(cardBox);
});
router.get("/cardBox", async (req, res) => {
  const cardBox = await CardBoxModel.findOne({ _id: req.query.id });
  res.send(await cardBox.populate("cards"));
  // res.send(req.query.id);
});

router.get("/mission", async (req, res, next) => {
  const user = req.body.user;
  try {
    const defaultMission = await MissionModel.findOne({
      _id: "64c8f10135840ecb570c8bc7",
    });
    if (!defaultMission.editor.includes(user.id)) {
      defaultMission.editor.push(user);
      // console.log(await defaultMission.populate("editor"));
      await defaultMission.save();
    }
    const mission = await MissionModel.findByUserId(user._id);
    res.send(mission);
  } catch (error) {
    next(error);
  }
});
router.delete("/mission", async (req, res, next) => {
  try {
    const user = req.body.user;
    const { id } = req.query as { id: string };
    const mission = await MissionModel.findOne({ _id: id });
    const user1 = await UserModel.findOne({ _id: user._id });
    if (mission.owner == user1.id) {
      console.log("mission");
      await MissionModel.deleteOne({ _id: id });
      res.send(new BaseVo("刪除成功"));
    }
  } catch (error) {
    next(error);
  }
});

router.put("/card", async (req, res) => {
  const body = req.body;
  const cardBox = await CardBoxModel.findOne({ _id: body._id });
  cardBox.addCard(body.cardName);
  res.send(cardBox);
});


export default router;
