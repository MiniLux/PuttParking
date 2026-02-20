export type GamePhase =
  | 'lobby'
  | 'starting'
  | 'playing'
  | 'hole_review'
  | 'course_end'
  | 'tournament_end';

export type GameMode = 'casual' | 'tournament';

export type TournamentLength = 3 | 6 | 9;

export interface GameSettings {
  mode: GameMode;
  tournamentLength?: TournamentLength;
  courseId?: string;
}

// Messages from client to server
export interface PuttMessage {
  dirX: number;
  dirZ: number;
  power: number;
}

export interface UsePowerUpMessage {
  powerUpId: string;
  targetPlayerId?: string;
}

export interface TeleportMessage {
  x: number;
  z: number;
}

export type ClientMessage =
  | { type: 'ready' }
  | { type: 'select_course'; courseId: string }
  | { type: 'start_game'; settings: GameSettings }
  | { type: 'putt'; data: PuttMessage }
  | { type: 'use_powerup'; data: UsePowerUpMessage }
  | { type: 'teleport'; data: TeleportMessage };
