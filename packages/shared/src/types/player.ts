export interface PlayerInfo {
  discordId: string;
  username: string;
  avatarUrl: string;
}

export interface PlayerScore {
  discordId: string;
  username: string;
  strokesPerHole: number[];
  totalStrokes: number;
  tournamentScore: number;
}
