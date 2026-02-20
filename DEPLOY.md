# Putt Parking - Deployment Guide

## Prerequisites

- [pnpm](https://pnpm.io/) installed
- [Fly.io CLI](https://fly.io/docs/hands-on/install-flyctl/) installed
- A [Cloudflare](https://dash.cloudflare.com/) account
- A [Discord Developer](https://discord.com/developers/applications) account

---

## 1. Discord Developer Portal Setup

1. Go to https://discord.com/developers/applications
2. Click **New Application** → name it "Putt Parking"
3. Note down the **Application ID** (this is your Client ID)
4. Go to **OAuth2** → note down the **Client Secret**
5. Under **OAuth2 → Redirects**, add: `https://your-app.pages.dev/` (your Cloudflare Pages URL, added after step 3)
6. Go to **Activities** → Enable Activities
7. Under **URL Mappings**, add:
   - `/` → `your-app.pages.dev` (your Cloudflare Pages domain)
   - `/colyseus` → `putt-parking.fly.dev` (your Fly.io domain)

---

## 2. Deploy Server to Fly.io

```bash
# From repo root
cd packages/server

# Create the app (first time only)
fly launch --name putt-parking --region iad --no-deploy

# Set secrets
fly secrets set DISCORD_CLIENT_ID=your_client_id_here
fly secrets set DISCORD_CLIENT_SECRET=your_secret_here

# Deploy (from repo root, since Dockerfile needs workspace context)
cd ../..
fly deploy --config packages/server/fly.toml --dockerfile packages/server/Dockerfile

# Verify
fly status
curl https://putt-parking.fly.dev/health
```

---

## 3. Deploy Client to Cloudflare Pages

### Option A: Connect GitHub (recommended)

1. Push your repo to GitHub
2. Go to https://dash.cloudflare.com/ → Pages → Create a project
3. Connect your GitHub repo
4. Build settings:
   - **Framework preset**: None
   - **Build command**: `pnpm install && pnpm --filter @putt-parking/client run build`
   - **Build output directory**: `packages/client/dist`
   - **Root directory**: `/` (repo root)
5. Environment variables:
   - `VITE_DISCORD_CLIENT_ID` = your Application ID
   - `NODE_VERSION` = `20`
6. Deploy

### Option B: Direct upload

```bash
# Build locally
cd packages/client
VITE_DISCORD_CLIENT_ID=your_client_id pnpm run build

# Install Wrangler if needed
pnpm add -g wrangler

# Deploy
wrangler pages deploy dist --project-name=putt-parking
```

---

## 4. Update Discord URL Mappings

After both are deployed, go back to the Discord Developer Portal:

1. **Activities → URL Mappings**:
   - Root mapping `/` → `your-app.pages.dev`
   - Prefix mapping `/colyseus` → `putt-parking.fly.dev`

2. **OAuth2 → Redirects**: Add `https://your-discord-activity-id.discordsays.com/`

---

## 5. Test

1. Open Discord (desktop app)
2. Join a voice channel
3. Click the Activities icon (rocket ship)
4. Find "Putt Parking" and launch it
5. The game should load, authenticate, and show the lobby

---

## Local Development

```bash
# Install dependencies
pnpm install

# Create .env in repo root
cp .env.example .env
# Fill in VITE_DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET

# Start dev servers (client + server concurrently)
pnpm dev

# For testing in Discord, use cloudflared tunnel:
# Terminal 1: pnpm dev
# Terminal 2: cloudflared tunnel --url http://localhost:5173
# Then set the tunnel URL in Discord Developer Portal → Activities → URL Mappings
```

---

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `VITE_DISCORD_CLIENT_ID` | Client build | Discord Application ID (Vite injects at build time) |
| `DISCORD_CLIENT_ID` | Server | Discord Application ID (for OAuth token exchange) |
| `DISCORD_CLIENT_SECRET` | Server | Discord OAuth2 Client Secret |
| `PORT` | Server | Server port (default: 2567) |

---

## Architecture

```
Discord Voice Channel
  ↓ (Activity iframe)
Cloudflare Pages (client SPA)
  ↓ (WebSocket via Discord URL mapping /colyseus)
Fly.io (Colyseus game server)
  ↓ (cannon-es physics)
Game State → broadcast to all players
```
