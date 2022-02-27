import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import { formatMessage } from "./helpers/formatDate.js";
import {
  getActiveUser,
  exitRoom,
  setNewUser,
  getUsers,
} from "./helpers/userHelper.js";

const app = new express();
const server = http.createServer(app);
const io = new Server(server);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Set public directory
app.use(express.static(path.join(__dirname, "public")));

// const "/" = "chat";

// this block will run when the client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username }) => {
    const user = setNewUser(socket.id, username);

    socket.join("/");

    // General welcome
    socket.emit(
      "message",
      formatMessage("WebChat", "Вы присоединились к комнате")
    );

    // Broadcast everytime users connects
    socket.broadcast
      .to("/")
      .emit(
        "message",
        formatMessage("WebChat", `${user.username} вошел в комнату`)
      );

    // Current active users
    io.to("/").emit("roomUsers", {
      users: getUsers("/"),
    });
  });

  // Listen for client message
  socket.on("chatMessage", (msg) => {
    const user = getActiveUser(socket.id);

    io.to("/").emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = exitRoom(socket.id);

    if (user) {
      io.to("/").emit(
        "message",
        formatMessage("WebChat", `${user.username} покинул комнату`)
      );

      // Current active users
      io.to("/").emit("roomUsers", {
        users: getUsers("/"),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
