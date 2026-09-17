import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socket",
  });
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);

      socket.on("signal", (data) => {
        io.to(data.to).emit("signal", {
          from: socket.id,
          signal: data.signal,
        });
      });

      socket.on("disconnect", () => {
        socket.to(roomId).emit("user-left", socket.id);
      });
    });
  });

  res.end();
}