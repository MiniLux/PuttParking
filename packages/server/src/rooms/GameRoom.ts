import { Room, Client } from "@colyseus/core";
import { GameState } from "../state/GameState.js";
import { PlayerState } from "../state/PlayerState.js";
import { GameManager } from "../game/GameManager.js";
import { MAX_PLAYERS } from "@putt-parking/shared";
import { getCourse, getAllCourses } from "../courses.js";

interface JoinOptions {
  channelId: string;
  discordId: string;
  username: string;
  avatarUrl: string;
}

export class GameRoom extends Room<GameState> {
  private nextColorIndex = 0;
  private gameManager!: GameManager;

  onCreate(options: { channelId?: string }) {
    this.setState(new GameState());
    this.maxClients = MAX_PLAYERS + 8;
    this.gameManager = new GameManager(this as any);

    console.log(`[GameRoom] Created room for channel: ${options.channelId}`);

    this.onMessage("ready", (client) => {
      const player = this.state.players.get(client.sessionId);
      if (player && !player.isSpectator) {
        player.isReady = !player.isReady;
        console.log(
          `[GameRoom] ${player.username} is ${player.isReady ? "ready" : "not ready"}`,
        );
        this.checkAllReady();
      }
    });

    this.onMessage(
      "start_game",
      (
        client,
        data: {
          courseId?: string;
          mode?: string;
          tournamentLength?: number;
        },
      ) => {
        if (client.sessionId !== this.state.hostId) return;
        if (this.state.phase !== "lobby") return;

        if (data.mode === "tournament" && data.tournamentLength) {
          this.startTournament(data.tournamentLength);
        } else {
          this.startGame(data.courseId || "windmill-woods");
        }
      },
    );

    this.onMessage(
      "putt",
      (client, data: { dirX: number; dirZ: number; power: number }) => {
        this.gameManager.handlePutt(
          client.sessionId,
          data.dirX,
          data.dirZ,
          data.power,
        );
      },
    );

    this.onMessage(
      "use_powerup",
      (client, data: { powerUpId: string; targetPlayerId?: string }) => {
        const player = this.state.players.get(client.sessionId);
        if (!player || player.isSpectator) return;
        console.log(
          `[GameRoom] ${player.username} uses power-up: ${data.powerUpId}`,
        );
        this.gameManager.handleUsePowerUp(
          client.sessionId,
          data.powerUpId,
          data.targetPlayerId,
        );
      },
    );

    this.onMessage("return_to_lobby", (client) => {
      if (client.sessionId !== this.state.hostId) return;
      if (
        this.state.phase !== "course_end" &&
        this.state.phase !== "tournament_end"
      )
        return;
      this.returnToLobby();
    });
  }

  private checkAllReady() {
    let allReady = true;
    let playerCount = 0;
    this.state.players.forEach((player: PlayerState) => {
      if (!player.isSpectator) {
        playerCount++;
        if (!player.isReady) allReady = false;
      }
    });
    // Auto-start when all players ready (min 1)
    if (allReady && playerCount >= 1) {
      this.startGame("windmill-woods");
    }
  }

  private startGame(courseId: string) {
    const course = getCourse(courseId);
    if (!course) {
      console.error(`[GameRoom] Course not found: ${courseId}`);
      return;
    }
    console.log(`[GameRoom] Starting casual game on course: ${course.name}`);
    this.gameManager.startGame(course);
  }

  private startTournament(numCourses: number) {
    const allCourses = getAllCourses();
    // Shuffle and pick the requested number of courses
    const shuffled = [...allCourses].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(numCourses, allCourses.length));

    if (selected.length === 0) {
      console.error("[GameRoom] No courses available for tournament");
      return;
    }

    console.log(
      `[GameRoom] Starting tournament: ${selected.length} courses - ${selected.map((c) => c.name).join(", ")}`,
    );
    this.gameManager.startTournament(selected);
  }

  private returnToLobby() {
    this.state.phase = "lobby";
    this.state.players.forEach((player: PlayerState) => {
      if (!player.isSpectator) {
        player.isReady = false;
        player.totalStrokes = 0;
        player.strokes = 0;
        player.hasFinishedHole = false;
      }
    });
  }

  onJoin(client: Client, options: JoinOptions) {
    const playerCount = Array.from(this.state.players.values()).filter(
      (p: PlayerState) => !p.isSpectator,
    ).length;

    const player = new PlayerState();
    player.discordId = options.discordId;
    player.username = options.username;
    player.avatarUrl = options.avatarUrl;

    if (playerCount >= MAX_PLAYERS || this.state.phase !== "lobby") {
      player.isSpectator = true;
      console.log(`[GameRoom] ${options.username} joined as spectator`);
    } else {
      player.colorIndex = this.nextColorIndex++;
      console.log(
        `[GameRoom] ${options.username} joined as player #${playerCount + 1}`,
      );
    }

    if (!this.state.hostId && !player.isSpectator) {
      this.state.hostId = client.sessionId;
    }

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      console.log(`[GameRoom] ${player.username} left`);
    }
    this.state.players.delete(client.sessionId);

    if (this.state.hostId === client.sessionId) {
      const nextPlayer = Array.from(this.state.players.entries()).find(
        ([_, p]) => !p.isSpectator,
      );
      this.state.hostId = nextPlayer ? nextPlayer[0] : "";
    }
  }

  onDispose() {
    this.gameManager.dispose();
    console.log("[GameRoom] Room disposed");
  }
}
