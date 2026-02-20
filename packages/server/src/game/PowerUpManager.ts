import type { Room } from "@colyseus/core";
import type { GameState } from "../state/GameState.js";
import type { PlayerState } from "../state/PlayerState.js";
import type { PhysicsWorld } from "../physics/PhysicsWorld.js";
import {
  POWERUP_CATALOG,
  MAX_POWERUPS_PER_PLAYER,
  type PowerUpId,
  type Hole,
} from "@putt-parking/shared";

interface ActiveEffect {
  playerId: string;
  powerUpId: PowerUpId;
  expiresAt: number;
}

interface SpawnedPowerUp {
  id: string;
  powerUpId: PowerUpId;
  x: number;
  y: number;
  z: number;
  collected: boolean;
}

export class PowerUpManager {
  private room: Room<GameState>;
  private physics: PhysicsWorld;
  private activeEffects: ActiveEffect[] = [];
  private spawnedPowerUps: SpawnedPowerUp[] = [];
  private nextSpawnId = 0;

  constructor(room: Room<GameState>, physics: PhysicsWorld) {
    this.room = room;
    this.physics = physics;
  }

  spawnForHole(hole: Hole) {
    this.spawnedPowerUps = [];
    this.activeEffects = [];

    for (const spawn of hole.powerUpSpawns) {
      const randomPowerUp =
        POWERUP_CATALOG[Math.floor(Math.random() * POWERUP_CATALOG.length)];
      const spawnedId = `pu_${this.nextSpawnId++}`;
      this.spawnedPowerUps.push({
        id: spawnedId,
        powerUpId: randomPowerUp.id,
        x: spawn.position.x,
        y: spawn.position.y,
        z: spawn.position.z,
        collected: false,
      });
    }

    // Broadcast spawned power-ups to clients
    this.room.broadcast(
      "powerups_spawned",
      this.spawnedPowerUps.map((s) => ({
        id: s.id,
        powerUpId: s.powerUpId,
        x: s.x,
        y: s.y,
        z: s.z,
      })),
    );
  }

  checkPickups(playerId: string, ballX: number, ballZ: number) {
    const player = this.room.state.players.get(playerId);
    if (!player || player.powerUps.length >= MAX_POWERUPS_PER_PLAYER) return;

    for (const spawn of this.spawnedPowerUps) {
      if (spawn.collected) continue;
      const dx = ballX - spawn.x;
      const dz = ballZ - spawn.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 0.15) {
        spawn.collected = true;
        player.powerUps.push(spawn.powerUpId);

        this.room.broadcast("powerup_collected", {
          spawnId: spawn.id,
          playerId,
          powerUpId: spawn.powerUpId,
        });
        break;
      }
    }
  }

  usePowerUp(
    playerId: string,
    powerUpId: string,
    targetPlayerId?: string,
  ): boolean {
    const player = this.room.state.players.get(playerId);
    if (!player) return false;

    const idx = player.powerUps.indexOf(powerUpId);
    if (idx === -1) return false;

    const definition = POWERUP_CATALOG.find((p) => p.id === powerUpId);
    if (!definition) return false;

    // Remove from inventory
    player.powerUps.splice(idx, 1);

    // Apply effect
    switch (powerUpId as PowerUpId) {
      case "steady_aim":
        player.hasSteadyAim = true;
        break;

      case "power_shot":
        player.hasPowerShot = true;
        break;

      case "magnet":
        player.hasMagnet = true;
        this.addTimedEffect(playerId, "magnet", 5);
        break;

      case "rewind": {
        // Handled by GameManager - restore previous position
        this.room.broadcast("powerup_used", {
          playerId,
          powerUpId,
          targetPlayerId,
        });
        return true;
      }

      case "ghost_ball":
        player.hasGhostBall = true;
        this.addTimedEffect(playerId, "ghost_ball", 3);
        break;

      case "teleport":
        // Client will send teleport position separately
        this.room.broadcast("powerup_used", {
          playerId,
          powerUpId,
          targetPlayerId,
        });
        return true;

      case "super_size":
        this.applyToOpponents(
          playerId,
          (p) => {
            p.hasSuperSize = true;
            p.ballRadius = 0.06; // 3x normal
          },
          "super_size",
          10,
        );
        break;

      case "fun_size":
        this.applyToOpponents(
          playerId,
          (p) => {
            p.hasFunSize = true;
            p.ballRadius = 0.007; // ~0.35x normal
          },
          "fun_size",
          10,
        );
        break;

      case "ice_rink":
        this.applyToOpponents(
          playerId,
          (p) => {
            p.hasIceRink = true;
          },
          "ice_rink",
          8,
        );
        break;

      case "reversiball":
        this.applyToOpponents(
          playerId,
          (p) => {
            p.hasReversiball = true;
          },
          "reversiball",
          undefined,
        );
        break;

      case "twisted_aim":
        this.applyToOpponents(
          playerId,
          (p) => {
            p.hasTwistedAim = true;
          },
          "twisted_aim",
          8,
        );
        break;

      case "zanyball":
        this.applyToOpponents(
          playerId,
          (p) => {
            p.hasZanyball = true;
          },
          "zanyball",
          5,
        );
        break;

      case "steal": {
        if (!targetPlayerId) return false;
        const target = this.room.state.players.get(targetPlayerId);
        if (!target || target.powerUps.length === 0) return false;
        const stolenIdx = Math.floor(Math.random() * target.powerUps.length);
        const stolen = target.powerUps.at(stolenIdx);
        if (!stolen) return false;
        target.powerUps.splice(stolenIdx, 1);
        player.powerUps.push(stolen);
        break;
      }

      case "fog":
        this.applyToOpponents(
          playerId,
          (p) => {
            p.hasFog = true;
          },
          "fog",
          8,
        );
        break;

      case "earthquake":
        this.applyToOpponents(
          playerId,
          (p) => {
            p.hasEarthquake = true;
          },
          "earthquake",
          5,
        );
        break;
    }

    this.room.broadcast("powerup_used", {
      playerId,
      powerUpId,
      targetPlayerId,
    });
    return true;
  }

  private applyToOpponents(
    userId: string,
    apply: (p: PlayerState) => void,
    powerUpId: PowerUpId,
    duration: number | undefined,
  ) {
    this.room.state.players.forEach(
      (player: PlayerState, sessionId: string) => {
        if (sessionId === userId || player.isSpectator) return;
        apply(player);
        if (duration) {
          this.addTimedEffect(sessionId, powerUpId, duration);
        }
      },
    );
  }

  private addTimedEffect(
    playerId: string,
    powerUpId: PowerUpId,
    durationSeconds: number,
  ) {
    this.activeEffects.push({
      playerId,
      powerUpId,
      expiresAt: Date.now() + durationSeconds * 1000,
    });
  }

  update() {
    const now = Date.now();
    this.activeEffects = this.activeEffects.filter((effect) => {
      if (now >= effect.expiresAt) {
        this.removeEffect(effect.playerId, effect.powerUpId);
        return false;
      }
      return true;
    });
  }

  private removeEffect(playerId: string, powerUpId: PowerUpId) {
    const player = this.room.state.players.get(playerId);
    if (!player) return;

    switch (powerUpId) {
      case "magnet":
        player.hasMagnet = false;
        break;
      case "ghost_ball":
        player.hasGhostBall = false;
        break;
      case "super_size":
        player.hasSuperSize = false;
        player.ballRadius = 0.02;
        break;
      case "fun_size":
        player.hasFunSize = false;
        player.ballRadius = 0.02;
        break;
      case "ice_rink":
        player.hasIceRink = false;
        break;
      case "twisted_aim":
        player.hasTwistedAim = false;
        break;
      case "zanyball":
        player.hasZanyball = false;
        break;
      case "fog":
        player.hasFog = false;
        break;
      case "earthquake":
        player.hasEarthquake = false;
        break;
    }

    this.room.broadcast("effect_expired", { playerId, powerUpId });
  }

  clearAll() {
    this.spawnedPowerUps = [];
    this.activeEffects = [];
  }
}
