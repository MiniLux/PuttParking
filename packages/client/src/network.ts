import PartySocket from "partysocket";
import type { GameStateSyncData, ServerMsg } from "@putt-parking/shared";

let socket: PartySocket | null = null;
let localSessionId = "";

const stateSyncListeners: Array<(state: GameStateSyncData) => void> = [];
const messageListeners = new Map<string, Array<(data: any) => void>>();

export function onStateSync(cb: (state: GameStateSyncData) => void) {
  stateSyncListeners.push(cb);
}

export function onMessage(type: string, cb: (data: any) => void) {
  if (!messageListeners.has(type)) messageListeners.set(type, []);
  messageListeners.get(type)!.push(cb);
}

export function getSessionId(): string {
  return localSessionId;
}

export function getSocket(): PartySocket | null {
  return socket;
}

export async function connectToServer(
  channelId: string,
  discordId: string,
  username: string,
  avatarUrl: string,
): Promise<void> {
  const host = import.meta.env.VITE_PARTYKIT_HOST || "localhost:1999";

  socket = new PartySocket({
    host,
    room: channelId,
  });

  return new Promise<void>((resolve, reject) => {
    socket!.addEventListener("open", () => {
      socket!.send(
        JSON.stringify({
          type: "join",
          discordId,
          username,
          avatarUrl,
        }),
      );
    });

    socket!.addEventListener("message", (event) => {
      let msg: ServerMsg;
      try {
        msg = JSON.parse(event.data) as ServerMsg;
      } catch {
        return;
      }

      if (msg.type === "welcome") {
        localSessionId = msg.sessionId;
        for (const cb of stateSyncListeners) cb(msg.state);
        resolve();
        return;
      }

      if (msg.type === "state_sync") {
        for (const cb of stateSyncListeners) cb(msg.state);
        return;
      }

      // Route other messages to listeners
      const listeners = messageListeners.get(msg.type);
      if (listeners) {
        for (const cb of listeners) cb(msg);
      }
    });

    socket!.addEventListener("error", () => {
      reject(new Error("WebSocket connection failed"));
    });

    // Timeout after 10 seconds
    setTimeout(() => reject(new Error("Connection timeout")), 10000);
  });
}

export function send(type: string, data?: Record<string, any>) {
  socket?.send(JSON.stringify({ type, ...data }));
}

export function sendPutt(dirX: number, dirZ: number, power: number) {
  send("putt", { dirX, dirZ, power });
}

export function sendReady() {
  send("ready");
}

export function sendUsePowerUp(powerUpId: string, targetPlayerId?: string) {
  send("use_powerup", { powerUpId, targetPlayerId });
}
