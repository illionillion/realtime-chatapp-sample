import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import type { Server as IOServer } from "socket.io";

interface SocketServer extends HttpServer {
  io?: IOServer;
}

interface SocketServerWithIO extends NetSocket {
  server: SocketServer;
}

interface ResponseWithSocket extends NextApiResponse {
  socket: SocketServerWithIO;
}

export default function socketHandler(
  req: NextApiRequest,
  res: ResponseWithSocket
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  if (res.socket.server.io) {
    return res.send("server is already running");
  }
  console.log("Socket is initializing");
  const io = new Server(res.socket.server, { addTrailingSlash: false });
  res.socket.server.io = io;

  // コネクション確立
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("join_room", (roomId) => {
      // const room = socket.handshake.query.roomId;
      const roomSize = io.sockets.adapter.rooms.get(roomId)?.size;
      // console.log(`${roomId} has ${roomSize} member`);
      
      if (roomSize && roomSize >= 2) {
        // ルーム人数が2人以上の場合は参加を拒否
        socket.emit("join_room_error", "The room is full.");
        console.log("The room is full.");
        return;
      }

      socket.join(roomId);
      console.log(`user with id-${socket.id} joined room - ${roomId}`);
    });

    socket.on("send_msg", (data) => {
      console.log(data, "DATA");
      //This will send a message to a specific room ID
      socket.to(data.roomId).emit("receive_msg", data);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  res.socket.server.io = io;

  res.end();
}
