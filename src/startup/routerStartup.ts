import ErrorHandler from "@/Handler/ErrorHandler";
import {
  DemoRouter,
  MemberRouter,
  authMiddleware,
  googleRouter,
} from "@/Router";
import { generateUserToken } from "@/tools/UserTokenUtils";
import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  const { user } = req.body;
  const token = generateUserToken(user);
  res.send(token);
});
// google oauth驗證路由 (必須在驗證器前)
router.use("/auth", googleRouter);
// token驗證並取得userinfo 供後續使用
router.use(authMiddleware);
router.use("/member", MemberRouter);
router.use("/demo", DemoRouter);
router.use(ErrorHandler);
export default router;
