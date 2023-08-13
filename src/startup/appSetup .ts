import { Express, json, urlencoded } from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import socketIOSetup from "./socketIOSetup";
import ejs from "ejs";
import cors from "cors";
import { initPassport } from "@/tools/Auth";
import { config } from "dotenv";

const port = process.env.PORT || 8888;

const appSetup = (app: Express) => {
  config();
  // 跨域設定
  app.use(cors());
  app.use(urlencoded({ extended: true }));
  app.use(json());
  // 模板引擎
  app.engine("html", ejs.renderFile);
  app.set("view engine", "html");

  const server = http.createServer(app);

  const io = new Server(server, {
    path: "/ws",
    cors: {
      origin: "*",
    },
  });
  socketIOSetup(io);
  initPassport();

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
    server.listen(port, () => {
      console.log(`[server] http://localhost:${port}`);
    });
  })();
};

export default appSetup;
