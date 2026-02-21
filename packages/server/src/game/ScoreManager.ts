import type { RoomAdapter } from "../RoomAdapter.js";

export interface HoleScore {
  sessionId: string;
  username: string;
  strokes: number;
  total: number;
  vsPar: number;
}

export class ScoreManager {
  private room: RoomAdapter;
  private holeScores: Map<string, number[]> = new Map();

  constructor(room: RoomAdapter) {
    this.room = room;
  }

  recordHole(holeIndex: number, par: number) {
    for (const [sessionId, player] of Object.entries(this.room.state.players)) {
      if (player.isSpectator) continue;
      if (!this.holeScores.has(sessionId)) {
        this.holeScores.set(sessionId, []);
      }
      this.holeScores.get(sessionId)!.push(player.strokes);
    }
  }

  getHoleLeaderboard(par: number): HoleScore[] {
    const scores: HoleScore[] = [];
    for (const [sessionId, player] of Object.entries(this.room.state.players)) {
      if (player.isSpectator) continue;
      scores.push({
        sessionId,
        username: player.username,
        strokes: player.strokes,
        total: player.totalStrokes,
        vsPar: player.strokes - par,
      });
    }
    return scores.sort((a, b) => a.total - b.total);
  }

  getFinalLeaderboard(): HoleScore[] {
    const scores: HoleScore[] = [];
    for (const [sessionId, player] of Object.entries(this.room.state.players)) {
      if (player.isSpectator) continue;
      scores.push({
        sessionId,
        username: player.username,
        strokes: 0,
        total: player.totalStrokes,
        vsPar: 0,
      });
    }
    return scores.sort((a, b) => a.total - b.total);
  }

  reset() {
    this.holeScores.clear();
  }
}
