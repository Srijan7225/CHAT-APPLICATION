import express from "express";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import cors from "cors";

const app = express();

// Security headers
app.use(helmet());

// Allow your frontend origin in production
const ORIGIN = process.env.ORIGIN || "*";
app.use(cors({ origin: ORIGIN, credentials: true }));

// Serve static frontend
app.use(express.static("public"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: ORIGIN, methods: ["GET", "POST"] },
  pingTimeout: 20000,
  // Simple built-in recovery for brief disconnects
  connectionStateRecovery: {},
});

// (Optional) trust proxy when behind Render/Railway/NGINX
// app.set("trust proxy", 1);

app.get("/health", (req, res) => res.json({ status: "ok" }));

io.on("connection", (socket) => {
  // Called after client emits 'join'
  socket.on("join", ({ room, username }) => {
    socket.data.username = (username || "anon").slice(0, 30);
    const safeRoom = (room || "general").slice(0, 50);
    socket.join(safeRoom);
    socket.to(safeRoom).emit("system", `${socket.data.username} joined`);
  });

  // Broadcast a message to everyone in a room
  socket.on("message", ({ room, text }) => {
    const safeRoom = (room || "general").slice(0, 50);
    const payload = {
      id: socket.id,
      username: socket.data.username || "anon",
      text: String(text ?? "").slice(0, 2000),
      ts: Date.now(),
    };
    io.to(safeRoom).emit("message", payload);
  });

  // Typing indicator
  socket.on("typing", ({ room, isTyping }) => {
    const safeRoom = (room || "general").slice(0, 50);
    socket.to(safeRoom).emit("typing", {
      id: socket.id,
      username: socket.data.username || "anon",
      isTyping: !!isTyping,
    });
  });

  socket.on("disconnect", () => {
    // Optionally announce departure using stored room(s) if you track them
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
