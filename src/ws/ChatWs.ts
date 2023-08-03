import expressWs from "express-ws";
import ws from "ws";

const chat: { [props: string]: object[] } = {};
const clients: { [props: string]: ws[] } = {};
export default function (expressWs: expressWs.Instance) {
  expressWs.app.ws("/ws", (ws, req) => {
    const chatName = req.query.chat as string;
    if (!clients[chatName]) clients[chatName] = [];
    clients[chatName].push(ws);
    let userName: string;
    if (!chat[chatName]) chat[chatName] = [];
    ws.send(JSON.stringify(chat[chatName]));

    ws.on("message", (data: string) => {
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

function broadcast(obj: object, chatName: string) {
  chat[chatName].push(obj);
  console.log(chat[chatName]);
  for (const client of clients[chatName]) {
    client.send(JSON.stringify(obj));
  }
}
