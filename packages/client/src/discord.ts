import { DiscordSDK, patchUrlMappings } from "@discord/embedded-app-sdk";

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;

let discordSdk: DiscordSDK | null = null;
let auth: {
  user: { id: string; username: string; avatar?: string | null };
} | null = null;

export async function initDiscord(): Promise<{
  discordSdk: DiscordSDK;
  auth: { user: { id: string; username: string; avatar?: string | null } };
  channelId: string | null;
}> {
  discordSdk = new DiscordSDK(DISCORD_CLIENT_ID);

  await discordSdk.ready();

  // In production, patch URL mappings so fetch/WebSocket go through Discord's proxy
  if (import.meta.env.PROD) {
    patchUrlMappings([
      {
        prefix: "/colyseus",
        target: "putt-parking.fly.dev",
      },
    ]);
  }

  // Authorize
  const { code } = await discordSdk.commands.authorize({
    client_id: DISCORD_CLIENT_ID,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: ["identify", "guilds"],
  });

  // Exchange code for access token via our server
  const tokenResponse = await fetch("/colyseus/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to exchange token");
  }

  const { access_token } = await tokenResponse.json();

  // Authenticate with Discord client
  auth = await discordSdk.commands.authenticate({ access_token });

  if (!auth) {
    throw new Error("Discord authentication failed");
  }

  const channelId = discordSdk.channelId;

  console.log(
    `[Discord] Authenticated as ${auth.user.username}, channel: ${channelId}`,
  );

  return { discordSdk, auth, channelId };
}

export function getDiscordSdk() {
  return discordSdk;
}

export function getAuth() {
  return auth;
}
