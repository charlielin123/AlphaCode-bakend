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
import http from "http";
import { Server, Socket } from "socket.io";
import { emit } from "process";
import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import { ioDemo } from "./ws/DemoWs";

const { urlencoded, json } = pkg;
const app = express();
const expressWs = expressWss(app);
const server = http.createServer(app);

const io = new Server(server, { path: "/ws" ,cors: {
  origin: "*",
}});

io.on("connection", (socket) => {
  // console.log(socket.id);
  socket.emit("message", "socket connected");


  socket.on("message", (msg) => {
  });
  ioDemo(socket);
});

app.use(cors());
initPassport();

const port = process.env.PORT || 8888;
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(ListWs());
// ListWs(expressWs);

app.post("/login", (req, res) => {
  const { user } = req.body;
  const token = generateUserToken(user);
  res.send(token);
});
// google oauth驗證路由 (必須在驗證器前)
app.use("/auth", googleRouter);

ChatWs(expressWs);

// token驗證並取得userinfo 供後續使用
app.use(authMiddleware);

app.use("/member", MemberRouter);
app.use("/demo", DemoRouter);
// app.get("/", (req, res) => {
//   res.render("./index.html");
// });
app.use(ErrorHandler);

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

  server.listen(port);
  // app.listen(port, () => {
  //   console.log(`[server] http://localhost:${port}`);
  // });
})();
