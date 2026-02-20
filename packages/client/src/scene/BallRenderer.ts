import * as THREE from "three";
import { BALL_RADIUS } from "@putt-parking/shared";

const PLAYER_COLORS = [
  0x4caf50, // Green
  0x2196f3, // Blue
  0xff9800, // Orange
  0xe91e63, // Pink
  0x9c27b0, // Purple
  0x00bcd4, // Cyan
  0xffeb3b, // Yellow
  0xff5722, // Deep Orange
];

const TRAIL_LENGTH = 20;
const TRAIL_MIN_DISTANCE = 0.01;

interface BallData {
  mesh: THREE.Mesh;
  targetX: number;
  targetY: number;
  targetZ: number;
  currentX: number;
  currentY: number;
  currentZ: number;
  color: number;
  trail: THREE.Line;
  trailPositions: Float32Array;
  trailIndex: number;
  lastTrailX: number;
  lastTrailZ: number;
}

export class BallRenderer {
  private scene: THREE.Scene;
  private balls = new Map<string, BallData>();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  addBall(id: string, colorIndex: number, isLocalPlayer: boolean): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
    const color = PLAYER_COLORS[colorIndex % PLAYER_COLORS.length];
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.1,
      emissive: isLocalPlayer ? color : 0x000000,
      emissiveIntensity: isLocalPlayer ? 0.2 : 0,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    this.scene.add(mesh);

    // Trail
    const trailPositions = new Float32Array(TRAIL_LENGTH * 3);
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(trailPositions, 3),
    );
    trailGeometry.setDrawRange(0, 0);
    const trailMaterial = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.4,
      linewidth: 1,
    });
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    this.scene.add(trail);

    this.balls.set(id, {
      mesh,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      currentX: 0,
      currentY: 0,
      currentZ: 0,
      color,
      trail,
      trailPositions,
      trailIndex: 0,
      lastTrailX: 0,
      lastTrailZ: 0,
    });

    return mesh;
  }

  removeBall(id: string) {
    const ball = this.balls.get(id);
    if (ball) {
      this.scene.remove(ball.mesh);
      ball.mesh.geometry.dispose();
      (ball.mesh.material as THREE.Material).dispose();
      this.scene.remove(ball.trail);
      ball.trail.geometry.dispose();
      (ball.trail.material as THREE.Material).dispose();
      this.balls.delete(id);
    }
  }

  setTargetPosition(id: string, x: number, y: number, z: number) {
    const ball = this.balls.get(id);
    if (ball) {
      ball.targetX = x;
      ball.targetY = y;
      ball.targetZ = z;
    }
  }

  setPosition(id: string, x: number, y: number, z: number) {
    const ball = this.balls.get(id);
    if (ball) {
      ball.targetX = x;
      ball.targetY = y;
      ball.targetZ = z;
      ball.currentX = x;
      ball.currentY = y;
      ball.currentZ = z;
      ball.mesh.position.set(x, y, z);
      // Reset trail on teleport
      ball.trailIndex = 0;
      ball.trail.geometry.setDrawRange(0, 0);
      ball.lastTrailX = x;
      ball.lastTrailZ = z;
    }
  }

  getBallPosition(id: string): THREE.Vector3 | null {
    const ball = this.balls.get(id);
    if (!ball) return null;
    return ball.mesh.position.clone();
  }

  getBallMesh(id: string): THREE.Mesh | null {
    return this.balls.get(id)?.mesh || null;
  }

  update(dt: number) {
    const lerpFactor = 1 - Math.pow(0.001, dt);

    for (const ball of this.balls.values()) {
      ball.currentX += (ball.targetX - ball.currentX) * lerpFactor;
      ball.currentY += (ball.targetY - ball.currentY) * lerpFactor;
      ball.currentZ += (ball.targetZ - ball.currentZ) * lerpFactor;
      ball.mesh.position.set(ball.currentX, ball.currentY, ball.currentZ);

      // Update trail
      const dx = ball.currentX - ball.lastTrailX;
      const dz = ball.currentZ - ball.lastTrailZ;
      if (dx * dx + dz * dz > TRAIL_MIN_DISTANCE * TRAIL_MIN_DISTANCE) {
        const idx = ball.trailIndex % TRAIL_LENGTH;
        ball.trailPositions[idx * 3] = ball.currentX;
        ball.trailPositions[idx * 3 + 1] = ball.currentY + BALL_RADIUS * 0.5;
        ball.trailPositions[idx * 3 + 2] = ball.currentZ;
        ball.trailIndex++;
        ball.lastTrailX = ball.currentX;
        ball.lastTrailZ = ball.currentZ;

        const count = Math.min(ball.trailIndex, TRAIL_LENGTH);
        ball.trail.geometry.setDrawRange(0, count);
        (
          ball.trail.geometry.attributes.position as THREE.BufferAttribute
        ).needsUpdate = true;
      }
    }
  }

  clear() {
    for (const [id] of this.balls) {
      this.removeBall(id);
    }
  }
}
