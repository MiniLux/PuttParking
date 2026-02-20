import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { GameRoom } from "./rooms/GameRoom.js";
import { exchangeToken } from "./auth.js";
import { getCourse, getAllCourses } from "./courses.js";

const app = express();
app.use(cors());
app.use(express.json());

// Discord OAuth token exchange
app.post("/api/token", async (req, res) => {
  try {
    const { code } = req.body;
    const accessToken = await exchangeToken(code);
    res.json({ access_token: accessToken });
  } catch (err) {
    console.error("Token exchange failed:", err);
    res.status(500).json({ error: "Token exchange failed" });
  }
});

// Course data API
app.get("/api/course/:id", (req, res) => {
  const course = getCourse(req.params.id);
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(course);
});

app.get("/api/courses", (_req, res) => {
  res.json(getAllCourses());
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const httpServer = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

gameServer.define("game_room", GameRoom);

const port = Number(process.env.PORT) || 2567;
httpServer.listen(port, () => {
  console.log(`[PuttParking] Server listening on port ${port}`);
});
