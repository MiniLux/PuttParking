export interface PlayerData {
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
  // Active effects
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

export function createPlayerData(): PlayerData {
  return {
    discordId: "",
    username: "",
    avatarUrl: "",
    ballX: 0,
    ballY: 0,
    ballZ: 0,
    ballRadius: 0.02,
    strokes: 0,
    totalStrokes: 0,
    hasFinishedHole: false,
    isReady: false,
    isSpectator: false,
    isBallAtRest: true,
    colorIndex: 0,
    powerUps: [],
    hasSteadyAim: false,
    hasPowerShot: false,
    hasMagnet: false,
    hasGhostBall: false,
    hasSuperSize: false,
    hasFunSize: false,
    hasIceRink: false,
    hasReversiball: false,
    hasTwistedAim: false,
    hasZanyball: false,
    hasFog: false,
    hasEarthquake: false,
  };
}

export interface GameStateData {
  phase: string;
  gameMode: string;
  courseId: string;
  currentHole: number;
  holeTimeRemaining: number;
  courseIndex: number;
  totalCourses: number;
  hostId: string;
  players: Record<string, PlayerData>;
}

export function createGameState(): GameStateData {
  return {
    phase: "lobby",
    gameMode: "casual",
    courseId: "",
    currentHole: 0,
    holeTimeRemaining: 60,
    courseIndex: 0,
    totalCourses: 1,
    hostId: "",
    players: {},
  };
}
