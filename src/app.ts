import express from "express";
import { generateUserToken } from "./tools/UserTokenUtils";
import pkg from "body-parser";
import expressWss from "express-ws";
import ejs from "ejs";
import cors from "cors";
import { initPassport } from "./tools/Auth";
import mongoose from "mongoose";
import { ListWs, ChatWs } from "@/ws";
import {
  MemberRouter,
  googleRouter,
  DemoRouter,
  authMiddleware,
} from "./Router";
import ErrorHandler from "./Handler/ErrorHandler";
const { urlencoded, json } = pkg;
const app = express();
const expressWs = expressWss(app);
app.use(cors());
initPassport();

const port = process.env.PORT || 8888;
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(urlencoded({ extended: true }));
app.use(json());

app.post("/login", (req, res) => {
  const { user } = req.body;
  const token = generateUserToken(user);
  res.send(token);
});

// google oauth驗證路由 (必須在驗證器前)
app.use("/auth", googleRouter);

// token驗證並取得userinfo 供後續使用
app.use(authMiddleware);

app.use("/member", MemberRouter);
app.use("/demo", DemoRouter);
app.get("/", (req, res) => {
  res.render("./index.html");
});
app.use(ErrorHandler);

ListWs(expressWs);
ChatWs(expressWs);

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_LOCAL as string, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PWD,
      dbName: process.env.MONGO_DB,
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error");
  }

  app.listen(port, () => {
    console.log(`[server] http://localhost:${port}`);
    
  });
})();
