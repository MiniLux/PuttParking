// PartyKit provides env vars via room.env, not process.env
// This file is kept for any scripts that might use process.env
declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD_CLIENT_ID?: string;
    DISCORD_CLIENT_SECRET?: string;
  }
}
