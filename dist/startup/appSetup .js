"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socketIOSetup_1 = __importDefault(require("./socketIOSetup"));
const ejs_1 = __importDefault(require("ejs"));
const cors_1 = __importDefault(require("cors"));
const Auth_1 = require("../tools/Auth");
const dotenv_1 = require("dotenv");
const port = process.env.PORT || 8888;
const appSetup = (app) => {
    (0, dotenv_1.config)();
    // 跨域設定
    app.use((0, cors_1.default)());
    app.use((0, express_1.urlencoded)({ extended: true }));
    app.use((0, express_1.json)());
    // 模板引擎
    app.engine("html", ejs_1.default.renderFile);
    app.set("view engine", "html");
    const server = http_1.default.createServer(app);
    const io = new socket_io_1.Server(server, {
        path: "/ws",
        cors: {
            origin: "*",
        },
    });
    (0, socketIOSetup_1.default)(io);
    (0, Auth_1.initPassport)();
    (async () => {
        try {
            await mongoose_1.default.connect(process.env.MONGO_LOCAL, {
                user: process.env.MONGO_USER,
                pass: process.env.MONGO_PWD,
                dbName: process.env.MONGO_DB,
            });
            console.log("MongoDB Connected");
        }
        catch (error) {
            console.error("DB Connection Error");
        }
        server.listen(port, () => {
            console.log(`[server] http://localhost:${port}`);
        });
    })();
};
exports.default = appSetup;
//# sourceMappingURL=appSetup%20.js.map