import { initDiscord } from "./discord.js";
import { connectToServer } from "./network.js";
import { Game } from "./game/Game.js";

const loadingEl = document.getElementById("loading")!;
const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

const COURSE_INFO: Record<
  string,
  { name: string; theme: string; color: string }
> = {
  "windmill-woods": {
    name: "Windmill Woods",
    theme: "Forest",
    color: "#2d8a4e",
  },
  "neon-nights": { name: "Neon Nights", theme: "Neon City", color: "#e040fb" },
  "pirate-cove": { name: "Pirate Cove", theme: "Tropical", color: "#f4d03f" },
  "candy-land": { name: "Candy Land", theme: "Sweet", color: "#ff69b4" },
  "space-station": { name: "Space Station", theme: "Sci-Fi", color: "#42a5f5" },
  "haunted-manor": { name: "Haunted Manor", theme: "Spooky", color: "#7e57c2" },
};

async function main() {
  try {
    loadingEl.innerHTML =
      '<div class="spinner"></div><div>Connecting to Discord...</div>';

    const { auth, channelId } = await initDiscord();

    loadingEl.innerHTML =
      '<div class="spinner"></div><div>Joining game...</div>';

    const avatarUrl = auth.user.avatar
      ? `https://cdn.discordapp.com/avatars/${auth.user.id}/${auth.user.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(auth.user.id) % 5}.png`;

    const room = await connectToServer(
      channelId || "dev-channel",
      auth.user.id,
      auth.user.username,
      avatarUrl,
    );

    loadingEl.style.display = "none";

    const game = new Game(canvas, room);
    showLobbyUI(room);

    window.addEventListener("beforeunload", () => {
      game.dispose();
      room.leave();
    });
  } catch (err) {
    console.error("[PuttParking] Initialization failed:", err);
    loadingEl.innerHTML = `<div style="color: #f44336;">Failed to connect: ${err instanceof Error ? err.message : "Unknown error"}</div>`;
  }
}

function showLobbyUI(room: any) {
  const lobby = document.createElement("div");
  lobby.id = "lobby-ui";
  lobby.style.cssText = `
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: rgba(10,10,30,0.92); padding: 28px 32px; border-radius: 18px;
    min-width: 380px; max-width: 440px; color: white; text-align: center;
    font-family: 'Segoe UI', system-ui, sans-serif;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 12px 48px rgba(0,0,0,0.6);
    backdrop-filter: blur(16px);
  `;

  lobby.innerHTML = `
    <h1 style="margin:0 0 4px; font-size:30px; font-weight:800; letter-spacing:-0.5px;
      background:linear-gradient(135deg,#4CAF50,#00BCD4); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
      Putt Parking
    </h1>
    <p style="color:#888; margin:0 0 20px; font-size:13px;">Multiplayer Mini-Golf</p>

    <div id="player-list" style="margin-bottom:16px;"></div>

    <div id="mode-section" style="margin-bottom:16px; display:none;">
      <div style="display:flex; gap:6px; justify-content:center; margin-bottom:12px;">
        <button class="mode-btn active" data-mode="casual" style="
          flex:1; padding:8px 0; border-radius:8px; border:2px solid #4CAF50;
          background:rgba(76,175,80,0.15); color:#4CAF50; font-size:13px;
          font-weight:600; cursor:pointer; transition:all 0.2s;
        ">Casual</button>
        <button class="mode-btn" data-mode="tournament" style="
          flex:1; padding:8px 0; border-radius:8px; border:2px solid rgba(255,255,255,0.15);
          background:transparent; color:#aaa; font-size:13px;
          font-weight:600; cursor:pointer; transition:all 0.2s;
        ">Tournament</button>
      </div>

      <div id="casual-options">
        <div style="font-size:12px; color:#888; margin-bottom:8px;">Select Course</div>
        <div id="course-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:6px;"></div>
      </div>

      <div id="tournament-options" style="display:none;">
        <div style="font-size:12px; color:#888; margin-bottom:8px;">Tournament Length</div>
        <div style="display:flex; gap:6px; justify-content:center;">
          <button class="tlen-btn active" data-len="3" style="
            flex:1; padding:6px 0; border-radius:6px; border:2px solid #FFD700;
            background:rgba(255,215,0,0.12); color:#FFD700; font-size:13px;
            font-weight:600; cursor:pointer; transition:all 0.2s;
          ">3 Courses</button>
          <button class="tlen-btn" data-len="6" style="
            flex:1; padding:6px 0; border-radius:6px; border:2px solid rgba(255,255,255,0.15);
            background:transparent; color:#aaa; font-size:13px;
            font-weight:600; cursor:pointer; transition:all 0.2s;
          ">6 Courses</button>
        </div>
      </div>
    </div>

    <button id="ready-btn" style="
      background: #4CAF50; color: white; border: none; padding: 12px 0;
      border-radius: 10px; font-size: 15px; font-weight:600; cursor: pointer; width: 100%;
      transition: all 0.2s; letter-spacing:0.3px;
    ">Ready Up</button>
    <button id="start-btn" style="
      background: linear-gradient(135deg, #2196F3, #00BCD4); color: white;
      border: none; padding: 12px 0; border-radius: 10px; font-size: 15px;
      font-weight:600; cursor: pointer; width: 100%;
      margin-top: 8px; display: none; transition: all 0.2s; letter-spacing:0.3px;
    ">Start Game</button>
  `;

  document.getElementById("ui-overlay")!.appendChild(lobby);

  // State
  let isReady = false;
  let selectedMode: "casual" | "tournament" = "casual";
  let selectedCourse = "windmill-woods";
  let tournamentLength = 3;

  // Build course grid
  const courseGrid = document.getElementById("course-grid")!;
  for (const [id, info] of Object.entries(COURSE_INFO)) {
    const card = document.createElement("button");
    card.className = "course-card";
    card.dataset.courseId = id;
    const isSelected = id === selectedCourse;
    card.style.cssText = `
      padding:8px; border-radius:8px; text-align:left; cursor:pointer;
      border:2px solid ${isSelected ? info.color : "rgba(255,255,255,0.1)"};
      background:${isSelected ? info.color + "18" : "rgba(255,255,255,0.03)"};
      color:${isSelected ? "#fff" : "#aaa"}; transition:all 0.2s;
    `;
    card.innerHTML = `
      <div style="font-size:13px; font-weight:600;">${info.name}</div>
      <div style="font-size:11px; opacity:0.6;">${info.theme}</div>
    `;
    card.addEventListener("click", () => {
      selectedCourse = id;
      updateCourseGrid();
    });
    courseGrid.appendChild(card);
  }

  function updateCourseGrid() {
    courseGrid.querySelectorAll(".course-card").forEach((el) => {
      const card = el as HTMLButtonElement;
      const cid = card.dataset.courseId!;
      const info = COURSE_INFO[cid];
      const sel = cid === selectedCourse;
      card.style.borderColor = sel ? info.color : "rgba(255,255,255,0.1)";
      card.style.background = sel
        ? info.color + "18"
        : "rgba(255,255,255,0.03)";
      card.style.color = sel ? "#fff" : "#aaa";
    });
  }

  // Mode toggle
  lobby.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedMode = (btn as HTMLElement).dataset.mode as
        | "casual"
        | "tournament";
      lobby.querySelectorAll(".mode-btn").forEach((b) => {
        const el = b as HTMLElement;
        const active = el.dataset.mode === selectedMode;
        el.style.borderColor = active ? "#4CAF50" : "rgba(255,255,255,0.15)";
        el.style.background = active ? "rgba(76,175,80,0.15)" : "transparent";
        el.style.color = active ? "#4CAF50" : "#aaa";
      });
      document.getElementById("casual-options")!.style.display =
        selectedMode === "casual" ? "block" : "none";
      document.getElementById("tournament-options")!.style.display =
        selectedMode === "tournament" ? "block" : "none";
    });
  });

  // Tournament length toggle
  lobby.querySelectorAll(".tlen-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      tournamentLength = parseInt((btn as HTMLElement).dataset.len!);
      lobby.querySelectorAll(".tlen-btn").forEach((b) => {
        const el = b as HTMLElement;
        const active = parseInt(el.dataset.len!) === tournamentLength;
        el.style.borderColor = active ? "#FFD700" : "rgba(255,255,255,0.15)";
        el.style.background = active ? "rgba(255,215,0,0.12)" : "transparent";
        el.style.color = active ? "#FFD700" : "#aaa";
      });
    });
  });

  // Ready button
  const readyBtn = document.getElementById("ready-btn")!;
  readyBtn.addEventListener("click", () => {
    room.send("ready");
    isReady = !isReady;
    readyBtn.textContent = isReady ? "Not Ready" : "Ready Up";
    readyBtn.style.background = isReady ? "#F44336" : "#4CAF50";
  });

  // Start button
  const startBtn = document.getElementById("start-btn")!;
  startBtn.addEventListener("click", () => {
    if (selectedMode === "tournament") {
      room.send("start_game", { mode: "tournament", tournamentLength });
    } else {
      room.send("start_game", { courseId: selectedCourse });
    }
  });

  // Track players locally since Colyseus MapSchema iteration can be tricky
  const knownPlayers = new Map<string, any>();

  room.state.players.onAdd((player: any, sessionId: string) => {
    knownPlayers.set(sessionId, player);
    setTimeout(updatePlayers, 50);
  });
  room.state.players.onRemove((_player: any, sessionId: string) => {
    knownPlayers.delete(sessionId);
    setTimeout(updatePlayers, 50);
  });

  // Update player list
  const updatePlayers = () => {
    const playerList = document.getElementById("player-list");
    if (!playerList) return;
    let html = "";
    let playerCount = 0;

    knownPlayers.forEach((player, sessionId) => {
      if (player.isSpectator) return;
      playerCount++;
      const isHost = sessionId === room.state.hostId;
      const readyColor = player.isReady ? "#4CAF50" : "#555";
      const readyText = player.isReady ? "READY" : "waiting";
      html += `
        <div style="display:flex; align-items:center; gap:10px; padding:6px 8px;
          border-radius:8px; background:rgba(255,255,255,0.03); margin-bottom:4px;">
          <img src="${player.avatarUrl || ""}" style="width:28px; height:28px; border-radius:50%;
            border:2px solid ${readyColor};" onerror="this.style.display='none'" />
          <div style="flex:1; text-align:left;">
            <div style="font-size:13px; font-weight:500;">${player.username || "Player"}${isHost ? ' <span style="font-size:10px; background:#FFD700; color:#000; padding:1px 5px; border-radius:4px; font-weight:700; margin-left:4px;">HOST</span>' : ""}</div>
          </div>
          <div style="font-size:11px; font-weight:600; color:${readyColor};">${readyText}</div>
        </div>
      `;
    });

    playerList.innerHTML =
      html ||
      '<div style="color:#555; padding:12px; font-size:13px;">Waiting for players...</div>';

    // Show mode section and start button for host
    const modeSection = document.getElementById("mode-section")!;
    if (room.sessionId === room.state.hostId) {
      startBtn.style.display = "block";
      modeSection.style.display = "block";
    } else {
      startBtn.style.display = "none";
      modeSection.style.display = "none";
    }
  };

  setInterval(updatePlayers, 500);

  // Phase changes
  room.state.listen("phase", (phase: string) => {
    if (phase === "playing" || phase === "starting") {
      lobby.style.display = "none";
    } else if (phase === "lobby") {
      lobby.style.display = "block";
      isReady = false;
      readyBtn.textContent = "Ready Up";
      readyBtn.style.background = "#4CAF50";
    }
  });
}

main();
