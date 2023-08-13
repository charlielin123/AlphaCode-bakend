"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseVo_1 = require("../Vo/BaseVo");
const DemoWs_1 = require("../ws/DemoWs");
exports.default = (io) => {
    io.on("connection", (socket) => {
        // console.log(socket.id);
        socket.emit("message", "socket connected");
        socket.on("message", (msg) => {
            socket.broadcast.emit("error", new BaseVo_1.ErrorVo("msg"));
        });
        (0, DemoWs_1.ioDemo)(socket);
    });
};
//# sourceMappingURL=socketIOSetup.js.map