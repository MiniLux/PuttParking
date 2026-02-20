import { PhysicsWorld } from './PhysicsWorld.js';
import { MAX_PUTT_POWER } from '@putt-parking/shared';

export class BallController {
  private physics: PhysicsWorld;

  constructor(physics: PhysicsWorld) {
    this.physics = physics;
  }

  putt(playerId: string, dirX: number, dirZ: number, power: number, multiplier: number = 1) {
    // Normalize direction
    const len = Math.sqrt(dirX * dirX + dirZ * dirZ);
    if (len === 0) return;
    const nx = dirX / len;
    const nz = dirZ / len;

    // Clamp power to [0, 1] then scale
    const clampedPower = Math.max(0, Math.min(1, power));
    const force = clampedPower * MAX_PUTT_POWER * multiplier;

    this.physics.applyPutt(playerId, nx * force, nz * force, 1);
  }

  resetBall(playerId: string, x: number, y: number, z: number) {
    this.physics.setBallPosition(playerId, x, y, z);
  }

  isBallAtRest(playerId: string): boolean {
    return this.physics.isBallAtRest(playerId);
  }
}
