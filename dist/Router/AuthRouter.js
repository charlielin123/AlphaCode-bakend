"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserTokenUtils_1 = require("../tools/UserTokenUtils");
const UserModel_1 = require("../Models/UserModel");
const BaseVo_1 = require("../Vo/BaseVo");
const router = (0, express_1.Router)();
router.use("/**", async (req, res, next) => {
    try {
        const payload = (0, UserTokenUtils_1.decodedToken)(req.headers.authorization);
        if (!payload) {
            next(new BaseVo_1.LoginError("登入異常，請重新嘗試"));
        }
        const user = await UserModel_1.UserModel.findOne({ email: payload?._doc.email });
        req.body.user = user;
        next();
    }
    catch (error) {
        if (error?.name == "JsonWebTokenError") {
            next(new BaseVo_1.LoginError("登入異常，請重新嘗試"));
        }
        else {
            next(new BaseVo_1.LoginError(error.message));
        }
    }
});
exports.default = router;
//# sourceMappingURL=AuthRouter.js.map