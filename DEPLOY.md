# Putt Parking — Deployment Guide

Everything is free-tier: PartyKit (Cloudflare), Vercel, and Discord.

---

## Step 1: Create a Discord Application

1. Go to https://discord.com/developers/applications
2. Click **New Application**, name it "Putt Parking"
3. Copy the **Application ID** — this is your `DISCORD_CLIENT_ID`
4. Go to **OAuth2** in the sidebar
   - Copy the **Client Secret** — this is your `DISCORD_CLIENT_SECRET`
   - Under **Redirects**, add: `https://your-vercel-domain.vercel.app` (you'll get this URL in Step 3 — come back and add it then)
5. Go to **Activities** in the sidebar
   - Toggle **Enable Activities** on
   - You'll configure **URL Mappings** in Step 5 after you have your deployed URLs

---

## Step 2: Deploy the Game Server (PartyKit)

PartyKit hosts the real-time game server on Cloudflare's edge network for free.

```bash
# Login to PartyKit (creates a free account via GitHub)
npx partykit login

# Deploy the server
npx partykit deploy
```

After deploying, you'll see output like:
```
Deployed to https://putt-parking.YOUR_USERNAME.partykit.dev
```

Save this URL — this is your **PartyKit host**.

Now set the Discord secrets as environment variables:

```bash
npx partykit env add DISCORD_CLIENT_ID
# Paste your Application ID when prompted

npx partykit env add DISCORD_CLIENT_SECRET
# Paste your Client Secret when prompted
```

---

## Step 3: Deploy the Client (Vercel)

Vercel hosts the game client (HTML/JS/CSS) for free.

1. Push this repo to GitHub (if you haven't already):
   ```bash
   git add -A
   git commit -m "Putt Parking: PartyKit + Vercel"
   git push
   ```

2. Go to https://vercel.com and sign in with GitHub

3. Click **Add New Project** → import your `PuttParking` repo

4. In the **Configure Project** screen, set these **Environment Variables**:

   | Name | Value |
   |------|-------|
   | `VITE_DISCORD_CLIENT_ID` | Your Discord Application ID |
   | `VITE_PARTYKIT_HOST` | `putt-parking.YOUR_USERNAME.partykit.dev` (from Step 2, no `https://`) |
   | `DISCORD_CLIENT_ID` | Your Discord Application ID (same as above) |
   | `DISCORD_CLIENT_SECRET` | Your Discord Client Secret |

5. Click **Deploy**

After deploying, you'll get a URL like `putt-parking.vercel.app`. This is your **Vercel domain**.

Now go back to Step 1 and add this URL as an OAuth2 redirect in your Discord app.

---

## Step 4: Update the .env.example (optional)

For local development, copy `.env.example` to `.env` and fill it in:

```bash
cp .env.example .env
```

```env
VITE_DISCORD_CLIENT_ID=your_discord_application_id
VITE_PARTYKIT_HOST=putt-parking.YOUR_USERNAME.partykit.dev
DISCORD_CLIENT_ID=your_discord_application_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

---

## Step 5: Configure Discord Activity URL Mappings

This is the critical step that makes everything work inside Discord.

1. Go to https://discord.com/developers/applications → your app → **Activities**

2. Under **URL Mappings**, add these entries:

   | Prefix | Target |
   |--------|--------|
   | `/` | `putt-parking.vercel.app` (your Vercel domain) |
   | `/api` | `putt-parking.YOUR_USERNAME.partykit.dev` (your PartyKit host) |

   The `/` mapping serves the game client. The `/api` mapping routes token exchange requests to PartyKit's HTTP handler.

3. Under **Supported Platforms**, enable:
   - Web
   - Desktop (if desired)

4. Set the **Default Age Rating** as appropriate

---

## Step 6: Test It

### Test locally first:
```bash
pnpm install
pnpm dev
```
This starts PartyKit on `:1999` and Vite on `:5173`.

### Test inside Discord:

1. In the Discord Developer Portal, go to **Activities** → **Getting Started**
2. Enable **Developer Mode** in Discord (User Settings → Advanced)
3. In a voice channel, click the Activities icon (rocket ship) and look for "Putt Parking"
4. The activity should load inside Discord, show the lobby UI, and you can start a game

### Test with multiple players:
Have someone else join the same voice channel and launch the activity — they should appear in the lobby.

---

## Troubleshooting

### "Failed to exchange token"
- Check that `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` are set correctly in PartyKit env vars
- Check that the OAuth2 redirect URL in Discord matches your Vercel domain
- Check the `/api` URL mapping points to your PartyKit host

### WebSocket connection fails
- `VITE_PARTYKIT_HOST` must be just the hostname (e.g. `putt-parking.you.partykit.dev`), not a full URL with `https://`
- PartyKit must be deployed and running

### Activity doesn't appear in Discord
- Make sure Activities are enabled in your Discord app settings
- Make sure URL mappings are configured (Step 5)
- You may need to wait a few minutes for Discord to propagate changes

### Blank screen in activity
- Check browser console for errors (right-click → Inspect in the activity iframe)
- Ensure the `/` URL mapping points to your Vercel domain

---

## Architecture Overview

```
Discord Voice Channel
    ↓ (iframe)
Vercel (putt-parking.vercel.app)
    ├── Game client (Three.js, Discord SDK)
    ├── /api/token → Vercel serverless function (Discord OAuth)
    └── PartySocket connection
            ↓ (WebSocket)
PartyKit (putt-parking.you.partykit.dev)
    ├── Game server (physics, state, scoring)
    ├── HTTP: /token, /course/:id, /courses
    └── WebSocket: real-time game state sync
```

**Cost: $0/month** on free tiers of both Vercel and PartyKit.
