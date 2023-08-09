import { ErrorVo } from "@/Vo/BaseVo";
import { ioDemo } from "@/ws/DemoWs";
import { Server, Socket } from "socket.io";

export default (io: Server) => {
  io.on("connection", (socket: Socket) => {
    // console.log(socket.id);
    socket.emit("message", "socket connected");

    socket.on("message", (msg) => {
      socket.broadcast.emit("error", new ErrorVo("msg"));
    });
    ioDemo(socket);
  });
};
