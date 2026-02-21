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

interface BallData {
  mesh: THREE.Mesh;
  targetX: number;
  targetY: number;
  targetZ: number;
  currentX: number;
  currentY: number;
  currentZ: number;
  color: number;
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

    this.balls.set(id, {
      mesh,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      currentX: 0,
      currentY: 0,
      currentZ: 0,
      color,
    });

    return mesh;
  }

  removeBall(id: string) {
    const ball = this.balls.get(id);
    if (ball) {
      this.scene.remove(ball.mesh);
      ball.mesh.geometry.dispose();
      (ball.mesh.material as THREE.Material).dispose();
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
    }
  }

  clear() {
    for (const [id] of this.balls) {
      this.removeBall(id);
    }
  }
}
