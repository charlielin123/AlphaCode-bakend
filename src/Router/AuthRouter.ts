import { Router } from "express";
import { decodedToken } from "../tools/UserTokenUtils";
import { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../Models/UserModel";
import {  LoginError } from "@/Vo/BaseVo";

const router = Router();
router.use("/**", async (req, res, next) => {
  try {
    const payload = decodedToken(
      req.headers.authorization as string
    ) as JwtPayload;
    if (!payload) next(new LoginError("登入異常，請重新嘗試"));
    const user = await UserModel.findOne({ email: payload?._doc.email });
    req.body.user = user;
    // console.log("驗證成功")
    next();
  } catch (error) {
    if (error?.name == "JsonWebTokenError")
      next(new LoginError("登入異常，請重新嘗試"));
    else next(error);
  }
});

export default router;
