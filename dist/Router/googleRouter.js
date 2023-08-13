"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const UserTokenUtils_1 = require("../tools/UserTokenUtils");
const authRouter = (0, express_1.Router)();
//路由可自行定義,不過照慣例通常會是: /auth/facebook, /auth/twitter等
authRouter.get("/google", 
//使用passport.authenticate並指定google驗證策略,來驗證請求
// scope中可以帶入應用程式想要獲取的使用者資訊
passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
//在前面有設定已授權的重新導向URI,Google驗證成功後就會將瀏覽器導向此路由
authRouter.get("/google/callback", passport_1.default.authenticate("google", {
    session: false,
}), (req, res) => {
    console.log("callback");
    const token = (0, UserTokenUtils_1.generateUserToken)(req.user);
    res.send({ token });
});
exports.default = authRouter;
//# sourceMappingURL=googleRouter.js.map