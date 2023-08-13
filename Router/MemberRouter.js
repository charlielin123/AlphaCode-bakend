"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserModel_1 = require("../Models/UserModel");
const memberRouter = (0, express_1.Router)();
memberRouter.get("/", async (req, res) => {
    if (req.body.user) {
        const user = await UserModel_1.UserModel.findOne({ _id: req.body.user.id });
        res.send(user);
    }
    else {
        const users = await UserModel_1.UserModel.find();
        // console.log(req);
        res.send(users);
    }
});
exports.default = memberRouter;
//# sourceMappingURL=MemberRouter.js.map