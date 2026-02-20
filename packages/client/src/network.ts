import { Client, Room } from 'colyseus.js';

let client: Client | null = null;
let room: Room | null = null;

export async function connectToServer(
  channelId: string,
  discordId: string,
  username: string,
  avatarUrl: string
): Promise<Room> {
  const wsUrl = import.meta.env.PROD
    ? `wss://${window.location.host}/colyseus`
    : 'ws://localhost:2567';

  client = new Client(wsUrl);

  room = await client.joinOrCreate('game_room', {
    channelId,
    discordId,
    username,
    avatarUrl,
  });

  console.log(`[Network] Joined room: ${room.id}`);

  return room;
}

export function getRoom(): Room | null {
  return room;
}

export function sendPutt(dirX: number, dirZ: number, power: number) {
  room?.send('putt', { dirX, dirZ, power });
}

export function sendReady() {
  room?.send('ready');
}

export function sendUsePowerUp(powerUpId: string, targetPlayerId?: string) {
  room?.send('use_powerup', { powerUpId, targetPlayerId });
}
