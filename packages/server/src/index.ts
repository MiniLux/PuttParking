import type * as Party from "partykit/server";
import {
  type GameStateData,
  type PlayerData,
  createGameState,
  createPlayerData,
} from "./state/GameState.js";
import type { RoomAdapter } from "./RoomAdapter.js";
import { GameManager } from "./game/GameManager.js";
import { getCourse, getAllCourses } from "./courses.js";
import { MAX_PLAYERS } from "@putt-parking/shared";
import type {
  ClientMsg,
  GameStateSyncData,
  PlayerSyncData,
} from "@putt-parking/shared";

export default class PuttParkingServer implements Party.Server, RoomAdapter {
  state: GameStateData;
  private gameManager: GameManager;
  private nextColorIndex = 0;

  constructor(public room: Party.Room) {
    this.state = createGameState();
    this.gameManager = new GameManager(this);
  }

  // ── RoomAdapter implementation ──────────────────────────────────────

  broadcast(type: string, data: any, excludeId?: string) {
    const msg = JSON.stringify({ type, ...data });
    for (const conn of this.room.getConnections()) {
      if (conn.id !== excludeId) {
        conn.send(msg);
      }
    }
  }

  broadcastState() {
    const msg = JSON.stringify({
      type: "state_sync",
      state: this.getStateSyncData(),
    });
    for (const conn of this.room.getConnections()) {
      conn.send(msg);
    }
  }

  getPlayer(sessionId: string): PlayerData | undefined {
    return this.state.players[sessionId];
  }

  // ── HTTP handler (token exchange, course API) ───────────────────────

  async onRequest(req: Party.Request): Promise<Response> {
    const url = new URL(req.url);
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (req.method === "POST" && url.pathname.endsWith("/token")) {
      try {
        const { code } = (await req.json()) as { code: string };
        const tokenResponse = await fetch(
          "https://discord.com/api/oauth2/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: this.room.env.DISCORD_CLIENT_ID as string,
              client_secret: this.room.env.DISCORD_CLIENT_SECRET as string,
              grant_type: "authorization_code",
              code,
            }),
          },
        );
        if (!tokenResponse.ok) {
          return new Response("Token exchange failed", {
            status: 500,
            headers,
          });
        }
        const data = (await tokenResponse.json()) as {
          access_token: string;
        };
        return Response.json({ access_token: data.access_token }, { headers });
      } catch {
        return new Response("Token exchange error", { status: 500, headers });
      }
    }

    if (req.method === "GET" && url.pathname.includes("/course/")) {
      const courseId = url.pathname.split("/course/")[1];
      const course = getCourse(courseId);
      if (!course) {
        return new Response("Not found", { status: 404, headers });
      }
      return Response.json(course, { headers });
    }

    if (req.method === "GET" && url.pathname.endsWith("/courses")) {
      return Response.json(getAllCourses(), { headers });
    }

    return new Response("Not found", { status: 404, headers });
  }

  // ── WebSocket lifecycle ─────────────────────────────────────────────

  onConnect(conn: Party.Connection) {
    conn.send(
      JSON.stringify({
        type: "welcome",
        sessionId: conn.id,
        state: this.getStateSyncData(),
      }),
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    let msg: ClientMsg;
    try {
      msg = JSON.parse(message as string) as ClientMsg;
    } catch {
      return;
    }

    switch (msg.type) {
      case "join":
        this.handleJoin(sender, msg);
        break;
      case "ready":
        this.handleReady(sender);
        break;
      case "start_game":
        this.handleStartGame(sender, msg);
        break;
      case "putt":
        this.gameManager.handlePutt(sender.id, msg.dirX, msg.dirZ, msg.power);
        break;
      case "use_powerup":
        this.handleUsePowerUp(sender, msg);
        break;
      case "return_to_lobby":
        this.handleReturnToLobby(sender);
        break;
    }
  }

  onClose(conn: Party.Connection) {
    const player = this.state.players[conn.id];
    if (player) {
      console.log(`[PuttParking] ${player.username} left`);
    }
    delete this.state.players[conn.id];

    // If no players remain, reset everything to lobby
    const remainingPlayers = Object.keys(this.state.players).length;
    if (remainingPlayers === 0) {
      this.gameManager.stopAll();
      this.state = createGameState();
      this.nextColorIndex = 0;
      console.log("[PuttParking] All players left, resetting to lobby");
      return;
    }

    if (this.state.hostId === conn.id) {
      const nextPlayer = Object.entries(this.state.players).find(
        ([, p]) => !p.isSpectator,
      );
      this.state.hostId = nextPlayer ? nextPlayer[0] : "";
    }

    this.broadcast("player_left", { sessionId: conn.id });
    this.broadcastState();
  }

  // ── Message handlers ────────────────────────────────────────────────

  private handleJoin(
    conn: Party.Connection,
    msg: { discordId: string; username: string; avatarUrl: string },
  ) {
    const playerCount = Object.values(this.state.players).filter(
      (p) => !p.isSpectator,
    ).length;

    const player = createPlayerData();
    player.discordId = msg.discordId;
    player.username = msg.username;
    player.avatarUrl = msg.avatarUrl;

    if (playerCount >= MAX_PLAYERS || this.state.phase !== "lobby") {
      player.isSpectator = true;
      console.log(`[PuttParking] ${msg.username} joined as spectator`);
    } else {
      player.colorIndex = this.nextColorIndex++;
      console.log(
        `[PuttParking] ${msg.username} joined as player #${playerCount + 1}`,
      );
    }

    if (!this.state.hostId && !player.isSpectator) {
      this.state.hostId = conn.id;
    }

    this.state.players[conn.id] = player;

    this.broadcast("player_joined", {
      sessionId: conn.id,
      player: this.getPlayerSyncData(player),
    });
    this.broadcastState();
  }

  private handleReady(conn: Party.Connection) {
    const player = this.state.players[conn.id];
    if (player && !player.isSpectator) {
      player.isReady = !player.isReady;
      console.log(
        `[PuttParking] ${player.username} is ${player.isReady ? "ready" : "not ready"}`,
      );
      this.broadcastState();
    }
  }

  private handleStartGame(
    conn: Party.Connection,
    msg: { courseId?: string; mode?: string; tournamentLength?: number },
  ) {
    if (conn.id !== this.state.hostId) return;
    if (this.state.phase !== "lobby") return;

    if (msg.mode === "tournament" && msg.tournamentLength) {
      const allCourses = getAllCourses();
      const shuffled = [...allCourses].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(
        0,
        Math.min(msg.tournamentLength, allCourses.length),
      );
      if (selected.length > 0) {
        console.log(
          `[PuttParking] Starting tournament: ${selected.length} courses`,
        );
        this.gameManager.startTournament(selected);
      }
    } else {
      const courseId = msg.courseId || "windmill-woods";
      const course = getCourse(courseId);
      if (course) {
        console.log(`[PuttParking] Starting casual game on: ${course.name}`);
        this.gameManager.startGame(course);
      }
    }
  }

  private handleUsePowerUp(
    conn: Party.Connection,
    msg: { powerUpId: string; targetPlayerId?: string },
  ) {
    const player = this.state.players[conn.id];
    if (!player || player.isSpectator) return;
    console.log(
      `[PuttParking] ${player.username} uses power-up: ${msg.powerUpId}`,
    );
    this.gameManager.handleUsePowerUp(
      conn.id,
      msg.powerUpId,
      msg.targetPlayerId,
    );
  }

  private handleReturnToLobby(conn: Party.Connection) {
    if (conn.id !== this.state.hostId) return;
    if (
      this.state.phase !== "course_end" &&
      this.state.phase !== "tournament_end"
    )
      return;

    this.state.phase = "lobby";
    for (const [, player] of Object.entries(this.state.players)) {
      if (!player.isSpectator) {
        player.isReady = false;
        player.totalStrokes = 0;
        player.strokes = 0;
        player.hasFinishedHole = false;
      }
    }
    this.broadcastState();
  }

  // ── State serialization ─────────────────────────────────────────────

  private getStateSyncData(): GameStateSyncData {
    return {
      phase: this.state.phase,
      gameMode: this.state.gameMode,
      courseId: this.state.courseId,
      currentHole: this.state.currentHole,
      holeTimeRemaining: this.state.holeTimeRemaining,
      courseIndex: this.state.courseIndex,
      totalCourses: this.state.totalCourses,
      hostId: this.state.hostId,
      players: Object.fromEntries(
        Object.entries(this.state.players).map(([id, p]) => [
          id,
          this.getPlayerSyncData(p),
        ]),
      ),
    };
  }

  private getPlayerSyncData(p: PlayerData): PlayerSyncData {
    return {
      discordId: p.discordId,
      username: p.username,
      avatarUrl: p.avatarUrl,
      ballX: p.ballX,
      ballY: p.ballY,
      ballZ: p.ballZ,
      ballRadius: p.ballRadius,
      strokes: p.strokes,
      totalStrokes: p.totalStrokes,
      hasFinishedHole: p.hasFinishedHole,
      isReady: p.isReady,
      isSpectator: p.isSpectator,
      isBallAtRest: p.isBallAtRest,
      colorIndex: p.colorIndex,
      powerUps: [...p.powerUps],
      hasSteadyAim: p.hasSteadyAim,
      hasPowerShot: p.hasPowerShot,
      hasMagnet: p.hasMagnet,
      hasGhostBall: p.hasGhostBall,
      hasSuperSize: p.hasSuperSize,
      hasFunSize: p.hasFunSize,
      hasIceRink: p.hasIceRink,
      hasReversiball: p.hasReversiball,
      hasTwistedAim: p.hasTwistedAim,
      hasZanyball: p.hasZanyball,
      hasFog: p.hasFog,
      hasEarthquake: p.hasEarthquake,
    };
  }
}
