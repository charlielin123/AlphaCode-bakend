import { Router, Response, Request } from "express";
import passport from "passport";
import { generateUserToken } from "../tools/UserTokenUtils";

const authRouter = Router();
//路由可自行定義,不過照慣例通常會是: /auth/facebook, /auth/twitter等
authRouter.get(
  "/google",
  //使用passport.authenticate並指定google驗證策略,來驗證請求
  // scope中可以帶入應用程式想要獲取的使用者資訊
  passport.authenticate("google", { scope: ["email", "profile"] })
);
//在前面有設定已授權的重新導向URI,Google驗證成功後就會將瀏覽器導向此路由
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req: Request, res: Response) => {
    console.log("callback");
    const token = generateUserToken(req.user);
    res.send({token});
  }
);
export default authRouter;
