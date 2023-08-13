"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler_1 = __importDefault(require("../Handler/ErrorHandler"));
const Router_1 = require("../Router");
const UserTokenUtils_1 = require("../tools/UserTokenUtils");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/login", (req, res) => {
    const { user } = req.body;
    const token = (0, UserTokenUtils_1.generateUserToken)(user);
    res.send(token);
});
// google oauth驗證路由 (必須在驗證器前)
router.use("/auth", Router_1.googleRouter);
// token驗證並取得userinfo 供後續使用
router.use(Router_1.authMiddleware);
router.use("/member", Router_1.MemberRouter);
router.use("/demo", Router_1.DemoRouter);
router.use(ErrorHandler_1.default);
exports.default = router;
//# sourceMappingURL=routerStartup.js.map