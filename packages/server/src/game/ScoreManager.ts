import type { Room } from '@colyseus/core';
import type { GameState } from '../state/GameState.js';
import type { PlayerState } from '../state/PlayerState.js';

export interface HoleScore {
  sessionId: string;
  username: string;
  strokes: number;
  total: number;
  vsPar: number;
}

export class ScoreManager {
  private room: Room<GameState>;
  private holeScores: Map<string, number[]> = new Map(); // sessionId -> strokes per hole

  constructor(room: Room<GameState>) {
    this.room = room;
  }

  recordHole(holeIndex: number, par: number) {
    this.room.state.players.forEach((player: PlayerState, sessionId: string) => {
      if (player.isSpectator) return;
      if (!this.holeScores.has(sessionId)) {
        this.holeScores.set(sessionId, []);
      }
      this.holeScores.get(sessionId)!.push(player.strokes);
    });
  }

  getHoleLeaderboard(par: number): HoleScore[] {
    const scores: HoleScore[] = [];
    this.room.state.players.forEach((player: PlayerState, sessionId: string) => {
      if (player.isSpectator) return;
      scores.push({
        sessionId,
        username: player.username,
        strokes: player.strokes,
        total: player.totalStrokes,
        vsPar: player.strokes - par,
      });
    });
    return scores.sort((a, b) => a.total - b.total);
  }

  getFinalLeaderboard(): HoleScore[] {
    const scores: HoleScore[] = [];
    this.room.state.players.forEach((player: PlayerState, sessionId: string) => {
      if (player.isSpectator) return;
      scores.push({
        sessionId,
        username: player.username,
        strokes: 0,
        total: player.totalStrokes,
        vsPar: 0,
      });
    });
    return scores.sort((a, b) => a.total - b.total);
  }

  reset() {
    this.holeScores.clear();
  }
}
