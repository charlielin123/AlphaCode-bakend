"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chat = {};
const clients = {};
function default_1(expressWs) {
    expressWs.app.ws("/ws", (ws, req) => {
        const chatName = req.query.chat;
        if (!clients[chatName])
            clients[chatName] = [];
        clients[chatName].push(ws);
        let userName;
        if (!chat[chatName])
            chat[chatName] = [];
        ws.send(JSON.stringify(chat[chatName]));
        ws.on("message", (data) => {
            const { event, payload } = JSON.parse(data);
            ws.emit(event, payload);
        });
        ws.on("setName", (msg) => {
            userName = msg;
        });
        ws.on("sendMessage", (msg) => {
            const obj = { [userName]: msg };
            broadcast(obj, chatName);
        });
        ws.on("close", (e) => {
            console.log("close");
            console.log(e);
        });
    });
}
exports.default = default_1;
function broadcast(obj, chatName) {
    chat[chatName].push(obj);
    console.log(chat[chatName]);
    for (const client of clients[chatName]) {
        client.send(JSON.stringify(obj));
    }
}
//# sourceMappingURL=ChatWs.js.map