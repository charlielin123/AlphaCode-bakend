import { UserModel } from "@/Models/UserModel";
import { ErrorVo, LoginError } from "@/Vo/BaseVo";
import { decodedToken } from "@/tools/UserTokenUtils";
import { ioDemo } from "@/ws/DemoWs";
import { JwtPayload } from "jsonwebtoken";
import { Server, Socket } from "socket.io";

export default (io: Server) => {
  io.use(async (socket, next) => {
    console.log(socket.handshake);
    try {
      const payload = decodedToken(socket.handshake.auth.token) as JwtPayload;
      if (!payload) {
        next(new Error("登入異常，請重新嘗試1"));
      }

      const user = await UserModel.findOne({ email: payload?._doc.email });
      socket.join("user:" + user._id);
    } catch (error) {
      if (error?.name == "JsonWebTokenError") {
        next(new Error("登入異常，請重新嘗試2"));
      } else {
        next(new Error(error.message));
      }
    }
    next();
  });

  io.on("connection", (socket: Socket) => {
    socket.emit("message", "socket connected");

    socket.on("message", (msg) => {
      socket.broadcast.emit("error", new ErrorVo(msg));
    });
    ioDemo(socket);
  });
};
