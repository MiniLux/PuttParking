import type { StateManager } from "../state/StateManager.js";
import { SceneManager } from "../scene/SceneManager.js";
import { CourseRenderer } from "../scene/CourseRenderer.js";
import { BallRenderer } from "../scene/BallRenderer.js";
import { PowerUpRenderer } from "../scene/PowerUpRenderer.js";
import { EffectsManager } from "../scene/EffectsManager.js";
import { CameraController } from "./CameraController.js";
import { InputManager } from "./InputManager.js";
import {
  sendPutt,
  sendUsePowerUp,
  send,
  getSessionId,
  onMessage,
} from "../network.js";
import { AudioManager } from "../audio/AudioManager.js";
import { POWERUP_CATALOG } from "@putt-parking/shared";

export class Game {
  private sceneManager: SceneManager;
  private courseRenderer: CourseRenderer;
  private ballRenderer: BallRenderer;
  private powerUpRenderer: PowerUpRenderer;
  private effectsManager: EffectsManager;
  private cameraController: CameraController;
  private inputManager: InputManager;
  private audio: AudioManager;
  private stateManager: StateManager;
  private localSessionId: string;
  private animationId: number = 0;
  private lastTime: number = 0;

  // HUD state
  private currentPar = 3;
  private currentHoleNum = 1;
  private localStrokes = 0;
  private totalHoles = 6;

  constructor(canvas: HTMLCanvasElement, stateManager: StateManager) {
    this.stateManager = stateManager;
    this.localSessionId = getSessionId();

    this.sceneManager = new SceneManager(canvas);
    this.courseRenderer = new CourseRenderer(this.sceneManager.scene);
    this.ballRenderer = new BallRenderer(this.sceneManager.scene);
    this.powerUpRenderer = new PowerUpRenderer(this.sceneManager.scene);
    this.effectsManager = new EffectsManager(
      this.sceneManager.scene,
      this.sceneManager.camera,
    );
    this.cameraController = new CameraController(this.sceneManager.camera);
    this.inputManager = new InputManager(canvas, this.sceneManager.camera);
    this.audio = new AudioManager();

    this.inputManager.onPutt((input) => {
      sendPutt(input.dirX, input.dirZ, input.power);
      this.audio.playPutt(input.power);
      this.inputManager.setCanPutt(false);
    });

    this.createPowerUpBar();
    this.createMuteButton();
    this.setupStateListeners();
    this.injectStyles();

    this.lastTime = performance.now();
    this.animate();
  }

  private injectStyles() {
    if (document.getElementById("game-styles")) return;
    const style = document.createElement("style");
    style.id = "game-styles";
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        15% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
        25% { transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; }
        100% { opacity: 0; transform: translate(-50%, -60%) scale(1); }
      }
      @keyframes slideInRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
      }
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      @keyframes popIn {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        60% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
      @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-30px); opacity: 0; }
      }
      .powerup-btn:hover { transform: scale(1.15) !important; }
      .target-option:hover { background: rgba(255,255,255,0.12) !important; }
    `;
    document.head.appendChild(style);
  }

  private createPowerUpBar() {
    const bar = document.createElement("div");
    bar.id = "powerup-bar";
    bar.style.cssText = `
      position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%);
      display: flex; gap: 8px; pointer-events: auto;
    `;
    document.getElementById("ui-overlay")!.appendChild(bar);
  }

  private createMuteButton() {
    const btn = document.createElement("button");
    btn.id = "mute-btn";
    btn.style.cssText = `
      position: absolute; top: 12px; right: 12px;
      width: 36px; height: 36px; border-radius: 8px;
      background: rgba(10,10,30,0.8); border: 1px solid rgba(255,255,255,0.1);
      color: white; font-size: 16px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s; pointer-events: auto;
    `;
    btn.textContent = "\u266A";
    btn.addEventListener("click", () => {
      const muted = this.audio.toggleMute();
      btn.textContent = muted ? "\u266A\u0338" : "\u266A";
      btn.style.opacity = muted ? "0.5" : "1";
    });
    document.getElementById("ui-overlay")!.appendChild(btn);
  }

  private updatePowerUpBar(powerUps: string[]) {
    const bar = document.getElementById("powerup-bar");
    if (!bar) return;

    bar.innerHTML = "";
    for (const puId of powerUps) {
      const def = POWERUP_CATALOG.find((p) => p.id === puId);
      if (!def) continue;

      const btn = document.createElement("button");
      btn.className = "powerup-btn";
      btn.style.cssText = `
        width: 52px; height: 52px; border-radius: 12px;
        background: ${def.color}22; border: 2px solid ${def.color};
        color: white; font-size: 22px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.15s, box-shadow 0.2s;
        box-shadow: 0 0 12px ${def.color}44;
        position: relative;
      `;
      btn.textContent = def.icon;
      btn.title = `${def.name}: ${def.description}`;

      btn.addEventListener("click", () => {
        if (def.target === "opponent") {
          this.showTargetSelector(puId);
        } else {
          sendUsePowerUp(puId);
        }
      });
      bar.appendChild(btn);
    }
  }

  private showTargetSelector(powerUpId: string) {
    document.getElementById("target-selector")?.remove();

    const state = this.stateManager.getState();
    if (!state) return;

    const opponents: Array<{
      sessionId: string;
      username: string;
      avatarUrl: string;
    }> = [];
    for (const [sid, p] of Object.entries(state.players)) {
      if (sid !== this.localSessionId && !p.isSpectator) {
        opponents.push({
          sessionId: sid,
          username: p.username,
          avatarUrl: p.avatarUrl,
        });
      }
    }

    if (opponents.length === 0) return;
    if (opponents.length === 1) {
      sendUsePowerUp(powerUpId, opponents[0].sessionId);
      return;
    }

    const selector = document.createElement("div");
    selector.id = "target-selector";
    selector.style.cssText = `
      position: absolute; bottom: 115px; left: 50%; transform: translateX(-50%);
      background: rgba(10,10,30,0.92); border-radius: 12px; padding: 10px;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      pointer-events: auto; display: flex; gap: 6px;
    `;

    for (const opp of opponents) {
      const opt = document.createElement("button");
      opt.className = "target-option";
      opt.style.cssText = `
        display: flex; flex-direction: column; align-items: center; gap: 4px;
        padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05); color: white; cursor: pointer;
        transition: background 0.2s;
      `;
      opt.innerHTML = `
        <img src="${opp.avatarUrl}" style="width:28px; height:28px; border-radius:50%;"
          onerror="this.style.display='none'" />
        <span style="font-size:11px; white-space:nowrap;">${opp.username}</span>
      `;
      opt.addEventListener("click", () => {
        sendUsePowerUp(powerUpId, opp.sessionId);
        selector.remove();
      });
      selector.appendChild(opt);
    }

    const closeHandler = (e: MouseEvent) => {
      if (!selector.contains(e.target as Node)) {
        selector.remove();
        document.removeEventListener("click", closeHandler);
      }
    };
    setTimeout(() => document.addEventListener("click", closeHandler), 10);

    document.getElementById("ui-overlay")!.appendChild(selector);
  }

  private setupStateListeners() {
    // Player join/leave
    this.stateManager.onAdd((player, sessionId) => {
      if (player.isSpectator) return;
      const isLocal = sessionId === this.localSessionId;
      this.ballRenderer.addBall(sessionId, player.colorIndex, isLocal);
      this.ballRenderer.setPosition(
        sessionId,
        player.ballX,
        player.ballY,
        player.ballZ,
      );

      // Listen for per-player state changes
      this.stateManager.listenPlayer(
        sessionId,
        "isBallAtRest",
        (atRest: boolean) => {
          if (sessionId === this.localSessionId) {
            const p = this.stateManager.getPlayer(sessionId);
            this.inputManager.setCanPutt(atRest && !!p && !p.hasFinishedHole);
          }
        },
      );

      this.stateManager.listenPlayer(
        sessionId,
        "hasFinishedHole",
        (finished: boolean) => {
          if (finished) {
            this.ballRenderer.setPosition(sessionId, 0, -10, 0);
          }
        },
      );

      if (isLocal) {
        this.stateManager.listenPlayer(
          sessionId,
          "strokes",
          (strokes: number) => {
            this.localStrokes = strokes;
            if (document.getElementById("hud")) {
              this.updateHUD();
            }
          },
        );

        this.stateManager.listenPlayer(
          sessionId,
          "powerUps",
          (powerUps: string[]) => {
            this.updatePowerUpBar(powerUps);
          },
        );

        this.stateManager.listenPlayer(sessionId, "hasFog", (active: boolean) =>
          this.effectsManager.setFog(active),
        );
        this.stateManager.listenPlayer(
          sessionId,
          "hasEarthquake",
          (active: boolean) => this.effectsManager.setEarthquake(active),
        );
        this.stateManager.listenPlayer(
          sessionId,
          "hasTwistedAim",
          (active: boolean) => {
            if (active)
              this.showNotification("Your aim is twisted!", "#FF9800");
          },
        );
        this.stateManager.listenPlayer(
          sessionId,
          "hasReversiball",
          (active: boolean) => {
            if (active)
              this.showNotification("Your aim is reversed!", "#F44336");
          },
        );
        this.stateManager.listenPlayer(
          sessionId,
          "hasSuperSize",
          (active: boolean) => {
            if (active)
              this.showNotification("Your ball is SUPER SIZED!", "#E91E63");
          },
        );
        this.stateManager.listenPlayer(
          sessionId,
          "hasFunSize",
          (active: boolean) => {
            if (active) this.showNotification("Your ball is tiny!", "#9C27B0");
          },
        );
        this.stateManager.listenPlayer(
          sessionId,
          "hasIceRink",
          (active: boolean) => {
            if (active) this.showNotification("The floor is ice!", "#00BCD4");
          },
        );
      }
    });

    this.stateManager.onRemove((_player, sessionId) => {
      this.ballRenderer.removeBall(sessionId);
    });

    // Ball position sync (high-frequency dedicated message)
    this.stateManager.onBallSync((balls) => {
      for (const [sessionId, pos] of Object.entries(balls)) {
        this.ballRenderer.setTargetPosition(sessionId, pos.x, pos.y, pos.z);

        if (sessionId === this.localSessionId) {
          const ballPos = this.ballRenderer.getBallPosition(sessionId);
          if (ballPos) {
            this.cameraController.followBall(ballPos);
            this.inputManager.setBallPosition(ballPos);
          }
        }
      }
    });

    // Timer updates via state sync
    this.stateManager.listenState("holeTimeRemaining", (time: number) => {
      this.updateTimer(time);
    });

    // Power-up messages
    onMessage("powerups_spawned", (data: any) => {
      this.powerUpRenderer.spawnPickups(data.powerups);
    });

    onMessage("powerup_collected", (data: any) => {
      this.powerUpRenderer.removePickup(data.spawnId);
      if (data.playerId === this.localSessionId) {
        const def = POWERUP_CATALOG.find((p) => p.id === data.powerUpId);
        if (def) {
          this.showNotification(`Got ${def.name}!`, def.color);
          this.audio.playPowerUpPickup();
        }
      }
    });

    onMessage("powerup_used", (data: any) => {
      const state = this.stateManager.getState();
      const player = state?.players[data.playerId];
      if (player && data.playerId !== this.localSessionId) {
        const def = POWERUP_CATALOG.find((p) => p.id === data.powerUpId);
        if (
          def &&
          (def.target === "all_opponents" || def.target === "opponent")
        ) {
          this.showNotification(
            `${player.username} used ${def.name}!`,
            def.color,
          );
          this.audio.playPowerUpUsed();
        }
      }
    });

    onMessage("effect_expired", (data: any) => {
      if (data.playerId === this.localSessionId) {
        const def = POWERUP_CATALOG.find((p) => p.id === data.powerUpId);
        if (def) this.showNotification(`${def.name} wore off`, "#888");
      }
    });

    // Hole start
    onMessage("hole_start", (data: any) => {
      this.currentHoleNum = data.holeIndex + 1;
      this.currentPar = data.par;
      this.localStrokes = 0;
      this.cameraController.showOverview(data.teePosition, data.holePosition);
      this.updateHUD();
      this.effectsManager.clear();
      document.getElementById("target-selector")?.remove();
    });

    // Hole in
    onMessage("hole_in", (data: any) => {
      if (data.strokes === 1) {
        this.showNotification(`HOLE IN ONE! ${data.username}`, "#FFD700");
        this.spawnConfetti();
      } else {
        const vs = data.strokes - this.currentPar;
        const label =
          vs <= -2
            ? "Eagle!"
            : vs === -1
              ? "Birdie!"
              : vs === 0
                ? "Par"
                : `+${vs}`;
        const color = vs < 0 ? "#4CAF50" : vs === 0 ? "#fff" : "#F44336";
        this.showNotification(
          `${data.username} - ${label} (${data.strokes})`,
          color,
        );
      }
      if (data.playerId === this.localSessionId) {
        this.effectsManager.triggerHoleIn();
        this.audio.playHoleIn();
      }
    });

    // Hole end / leaderboard
    onMessage("hole_end", (data: any) => {
      this.showLeaderboard(data.scores, data.par);
    });

    // Course end
    onMessage("course_end", (data: any) => {
      this.showFinalResults(data.scores, false);
    });

    // Tournament end
    onMessage("tournament_end", (data: any) => {
      this.showFinalResults(data.scores, true);
    });

    // Phase changes
    this.stateManager.listenState("phase", (phase: string) => {
      if (phase === "lobby") {
        this.showLobby();
      }
    });

    this.stateManager.listenState("currentHole", (holeIndex: number) => {
      this.loadHole(holeIndex);
    });
  }

  private async loadHole(holeIndex: number) {
    try {
      const state = this.stateManager.getState();
      if (!state) return;
      const courseId = state.courseId;

      // In dev, use /api proxy; in prod, use /api which goes through Discord URL mapping
      const response = await fetch(
        `/api/parties/main/default/course/${courseId}`,
      );
      if (response.ok) {
        const course = await response.json();
        this.totalHoles = course.holes.length;
        if (course.holes[holeIndex]) {
          this.courseRenderer.buildHole(course.holes[holeIndex]);
          this.sceneManager.setTheme(course.theme || "forest");
        }
      }
    } catch (err) {
      console.error("[Game] Failed to load hole data:", err);
    }
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.courseRenderer.update(dt);
    this.ballRenderer.update(dt);
    this.powerUpRenderer.update(dt);
    this.effectsManager.update(dt);
    this.cameraController.update(dt);

    this.sceneManager.render();
  }

  private updateHUD() {
    let hud = document.getElementById("hud");
    if (!hud) {
      hud = document.createElement("div");
      hud.id = "hud";
      hud.style.cssText = `
        position: absolute; top: 12px; left: 12px;
        display: flex; gap: 8px; pointer-events: none;
      `;
      document.getElementById("ui-overlay")!.appendChild(hud);
    }

    const vs = this.localStrokes - this.currentPar;
    const vsStr =
      this.localStrokes === 0
        ? ""
        : vs === 0
          ? " (E)"
          : vs > 0
            ? ` (+${vs})`
            : ` (${vs})`;
    const vsColor = vs < 0 ? "#4CAF50" : vs === 0 ? "#ccc" : "#F44336";

    hud.innerHTML = `
      <div style="background:rgba(10,10,30,0.8); padding:8px 14px; border-radius:10px;
        font-size:13px; display:flex; align-items:center; gap:12px;
        border:1px solid rgba(255,255,255,0.06);">
        <div>
          <div style="font-size:10px; color:#888; text-transform:uppercase; letter-spacing:1px;">Hole</div>
          <div style="font-size:18px; font-weight:700;">${this.currentHoleNum}<span style="font-size:12px; color:#666;">/${this.totalHoles}</span></div>
        </div>
        <div style="width:1px; height:28px; background:rgba(255,255,255,0.1);"></div>
        <div>
          <div style="font-size:10px; color:#888; text-transform:uppercase; letter-spacing:1px;">Par</div>
          <div style="font-size:18px; font-weight:700;">${this.currentPar}</div>
        </div>
        <div style="width:1px; height:28px; background:rgba(255,255,255,0.1);"></div>
        <div>
          <div style="font-size:10px; color:#888; text-transform:uppercase; letter-spacing:1px;">Strokes</div>
          <div style="font-size:18px; font-weight:700;">${this.localStrokes}<span style="font-size:12px; color:${vsColor};">${vsStr}</span></div>
        </div>
      </div>
      <div id="hud-timer" style="background:rgba(10,10,30,0.8); padding:8px 14px; border-radius:10px;
        font-size:13px; display:flex; align-items:center;
        border:1px solid rgba(255,255,255,0.06);">
        <div>
          <div style="font-size:10px; color:#888; text-transform:uppercase; letter-spacing:1px;">Time</div>
          <div id="timer-value" style="font-size:18px; font-weight:700;">60</div>
        </div>
      </div>
    `;
  }

  private updateTimer(seconds: number) {
    const timerVal = document.getElementById("timer-value");
    if (timerVal) {
      const s = Math.ceil(seconds);
      timerVal.textContent = `${s}`;
      timerVal.style.color = s <= 10 ? "#F44336" : s <= 20 ? "#FF9800" : "#fff";
    }
  }

  private showNotification(text: string, color = "#4CAF50") {
    const el = document.createElement("div");
    el.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(10,10,30,0.85); color: ${color}; padding: 14px 32px;
      border-radius: 12px; font-size: 18px; font-weight: 700;
      animation: fadeInOut 2.2s forwards; pointer-events: none;
      border: 1px solid ${color}33;
      box-shadow: 0 4px 24px ${color}22;
      letter-spacing: 0.3px;
    `;
    el.textContent = text;
    document.getElementById("ui-overlay")!.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  private spawnConfetti() {
    const colors = [
      "#FFD700",
      "#FF6B6B",
      "#4CAF50",
      "#2196F3",
      "#E040FB",
      "#00BCD4",
      "#FF9800",
    ];
    const container = document.getElementById("ui-overlay")!;
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 0.5;
      const duration = 1.5 + Math.random() * 1.5;
      const size = 4 + Math.random() * 6;
      piece.style.cssText = `
        position: absolute; top: -10px; left: ${left}%;
        width: ${size}px; height: ${size * 1.5}px;
        background: ${color}; border-radius: 2px;
        animation: confettiFall ${duration}s ${delay}s ease-in forwards;
        pointer-events: none;
      `;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), (duration + delay) * 1000 + 100);
    }
  }

  private showLeaderboard(scores: any[], par: number) {
    document.getElementById("leaderboard")?.remove();

    const lb = document.createElement("div");
    lb.id = "leaderboard";
    lb.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(10,10,30,0.92); padding: 24px 28px; border-radius: 16px;
      min-width: 300px; color: white; text-align: center;
      animation: popIn 0.3s ease-out forwards;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 12px 48px rgba(0,0,0,0.6);
    `;

    let html = `
      <div style="font-size:12px; color:#888; text-transform:uppercase; letter-spacing:2px; margin-bottom:4px;">Hole ${this.currentHoleNum} Complete</div>
      <div style="font-size:20px; font-weight:700; margin-bottom:16px;">Leaderboard</div>
    `;

    for (let i = 0; i < scores.length; i++) {
      const s = scores[i];
      const vs = s.strokes - par;
      const vsStr = vs === 0 ? "E" : vs > 0 ? `+${vs}` : `${vs}`;
      const vsColor = vs < 0 ? "#4CAF50" : vs === 0 ? "#ccc" : "#F44336";
      const isLocal = s.sessionId === this.localSessionId;
      const bg = isLocal ? "rgba(76,175,80,0.1)" : "transparent";

      html += `
        <div style="display:flex; align-items:center; gap:10px; padding:8px 10px;
          border-radius:8px; background:${bg}; margin-bottom:2px;
          animation: slideInRight 0.3s ${i * 0.05}s both ease-out;">
          <div style="font-size:14px; font-weight:700; width:20px; color:#888;">${i + 1}</div>
          <div style="flex:1; text-align:left; font-size:14px; font-weight:${isLocal ? "700" : "400"};">${s.username}</div>
          <div style="font-size:14px; color:${vsColor}; font-weight:600;">${s.strokes} <span style="font-size:11px;">(${vsStr})</span></div>
          <div style="font-size:12px; color:#888; width:40px; text-align:right;">Tot: ${s.total}</div>
        </div>
      `;
    }

    lb.innerHTML = html;
    document.getElementById("ui-overlay")!.appendChild(lb);

    setTimeout(() => {
      if (lb.parentNode) {
        lb.style.animation = "slideOutRight 0.3s ease-in forwards";
        setTimeout(() => lb.remove(), 300);
      }
    }, 5000);
  }

  private showFinalResults(scores: any[], isTournament: boolean) {
    document.getElementById("final-results")?.remove();

    const results = document.createElement("div");
    results.id = "final-results";
    results.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(10,10,30,0.95); padding: 32px; border-radius: 18px;
      min-width: 340px; color: white; text-align: center;
      animation: popIn 0.4s ease-out forwards;
      border: 1px solid rgba(255,215,0,0.15);
      box-shadow: 0 16px 64px rgba(0,0,0,0.7);
    `;

    const title = isTournament ? "Tournament Complete!" : "Course Complete!";
    let html = `
      <div style="font-size:28px; font-weight:800; margin-bottom:4px;
        background:linear-gradient(135deg,#FFD700,#FFA000); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
        ${title}
      </div>
      <div style="color:#888; margin-bottom:20px; font-size:13px;">Final Standings</div>
    `;

    const medals = ["#FFD700", "#C0C0C0", "#CD7F32"];
    const medalLabels = ["1st", "2nd", "3rd"];

    for (let i = 0; i < scores.length; i++) {
      const s = scores[i];
      const isLocal = s.sessionId === this.localSessionId;
      const medalColor = i < 3 ? medals[i] : "transparent";
      const label = i < 3 ? medalLabels[i] : `#${i + 1}`;
      const bg = isLocal ? "rgba(76,175,80,0.1)" : "rgba(255,255,255,0.02)";

      html += `
        <div style="display:flex; align-items:center; gap:12px; padding:10px 12px;
          border-radius:10px; background:${bg}; margin-bottom:4px;
          border-left:3px solid ${medalColor};
          animation: slideInRight 0.3s ${i * 0.08}s both ease-out;">
          <div style="font-size:13px; font-weight:700; color:${i < 3 ? medalColor : "#666"}; min-width:28px;">${label}</div>
          <div style="flex:1; text-align:left;">
            <div style="font-size:15px; font-weight:${isLocal ? "700" : "500"};">${s.username}</div>
          </div>
          <div style="font-size:16px; font-weight:700;">${s.total}<span style="font-size:11px; color:#888;"> strokes</span></div>
        </div>
      `;
    }

    html += `
      <button id="return-lobby-btn" style="
        margin-top:20px; background:linear-gradient(135deg,#4CAF50,#00BCD4); color:white;
        border:none; padding:12px 0; border-radius:10px; font-size:14px;
        font-weight:600; cursor:pointer; width:100%; transition:opacity 0.2s;
        display:none;
      ">Return to Lobby</button>
    `;

    results.innerHTML = html;
    document.getElementById("ui-overlay")!.appendChild(results);

    if (scores.length > 0 && scores[0].sessionId === this.localSessionId) {
      this.spawnConfetti();
    }

    const returnBtn = document.getElementById("return-lobby-btn")!;
    const state = this.stateManager.getState();
    if (getSessionId() === state?.hostId) {
      returnBtn.style.display = "block";
      returnBtn.addEventListener("click", () => {
        send("return_to_lobby");
      });
    }
  }

  private showLobby() {
    this.courseRenderer.clear();
    this.ballRenderer.clear();
    this.powerUpRenderer.clear();
    this.effectsManager.clear();

    document.getElementById("final-results")?.remove();
    document.getElementById("leaderboard")?.remove();
    document.getElementById("hud")?.remove();
    document.getElementById("target-selector")?.remove();

    const bar = document.getElementById("powerup-bar");
    if (bar) bar.innerHTML = "";

    this.sceneManager.setTheme("default");
  }

  dispose() {
    cancelAnimationFrame(this.animationId);
    this.effectsManager.clear();
    this.audio.dispose();
  }
}
