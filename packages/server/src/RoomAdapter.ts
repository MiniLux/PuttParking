import type { GameStateData, PlayerData } from './state/GameState.js';

export interface RoomAdapter {
  state: GameStateData;
  broadcast(type: string, data: any): void;
  broadcastState(): void;
  getPlayer(sessionId: string): PlayerData | undefined;
}
