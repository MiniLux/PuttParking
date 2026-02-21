import type { Vec3 } from './course.js';
import type { PowerUpId } from './powerup.js';

// ── Player data sent over the wire ──────────────────────────────────────

export interface PlayerSyncData {
  discordId: string;
  username: string;
  avatarUrl: string;
  ballX: number;
  ballY: number;
  ballZ: number;
  ballRadius: number;
  strokes: number;
  totalStrokes: number;
  hasFinishedHole: boolean;
  isReady: boolean;
  isSpectator: boolean;
  isBallAtRest: boolean;
  colorIndex: number;
  powerUps: string[];
  hasSteadyAim: boolean;
  hasPowerShot: boolean;
  hasMagnet: boolean;
  hasGhostBall: boolean;
  hasSuperSize: boolean;
  hasFunSize: boolean;
  hasIceRink: boolean;
  hasReversiball: boolean;
  hasTwistedAim: boolean;
  hasZanyball: boolean;
  hasFog: boolean;
  hasEarthquake: boolean;
}

export interface GameStateSyncData {
  phase: string;
  gameMode: string;
  courseId: string;
  currentHole: number;
  holeTimeRemaining: number;
  courseIndex: number;
  totalCourses: number;
  hostId: string;
  players: Record<string, PlayerSyncData>;
}

// ── Client → Server messages ────────────────────────────────────────────

export type ClientMsg =
  | { type: 'join'; discordId: string; username: string; avatarUrl: string }
  | { type: 'ready' }
  | { type: 'start_game'; courseId?: string; mode?: string; tournamentLength?: number }
  | { type: 'putt'; dirX: number; dirZ: number; power: number }
  | { type: 'use_powerup'; powerUpId: string; targetPlayerId?: string }
  | { type: 'return_to_lobby' };

// ── Server → Client messages ────────────────────────────────────────────

export interface HoleScoreEntry {
  sessionId: string;
  username: string;
  strokes: number;
  total: number;
}

export interface CourseScoreEntry {
  sessionId: string;
  username: string;
  total: number;
}

export interface SpawnedPowerUpData {
  id: string;
  powerUpId: PowerUpId;
  x: number;
  y: number;
  z: number;
}

export type ServerMsg =
  | { type: 'welcome'; sessionId: string; state: GameStateSyncData }
  | { type: 'state_sync'; state: GameStateSyncData }
  | { type: 'ball_sync'; balls: Record<string, { x: number; y: number; z: number }> }
  | { type: 'hole_start'; holeIndex: number; par: number; teePosition: Vec3; holePosition: Vec3 }
  | { type: 'hole_in'; playerId: string; username: string; strokes: number }
  | { type: 'hole_end'; holeIndex: number; par: number; scores: HoleScoreEntry[] }
  | { type: 'course_end'; scores: CourseScoreEntry[]; isTournament: boolean; courseIndex: number; totalCourses: number }
  | { type: 'tournament_end'; scores: CourseScoreEntry[] }
  | { type: 'powerups_spawned'; powerups: SpawnedPowerUpData[] }
  | { type: 'powerup_collected'; spawnId: string; playerId: string; powerUpId: string }
  | { type: 'powerup_used'; playerId: string; powerUpId: string; targetPlayerId?: string }
  | { type: 'effect_expired'; playerId: string; powerUpId: string }
  | { type: 'player_joined'; sessionId: string; player: PlayerSyncData }
  | { type: 'player_left'; sessionId: string };
