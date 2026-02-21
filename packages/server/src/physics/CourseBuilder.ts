import * as CANNON from "cannon-es";
import type { Hole, Surface, Wall, Obstacle } from "@putt-parking/shared";
import { PhysicsWorld } from "./PhysicsWorld.js";
import { HOLE_RADIUS } from "@putt-parking/shared";

export class CourseBuilder {
  private physics: PhysicsWorld;

  constructor(physics: PhysicsWorld) {
    this.physics = physics;
  }

  buildHole(hole: Hole) {
    this.physics.clearStatic();

    // Build surfaces
    for (const surface of hole.surfaces) {
      this.buildSurface(surface);
    }

    // Build walls
    for (const wall of hole.walls) {
      this.buildWall(wall);
    }

    // Build obstacles
    for (const obstacle of hole.obstacles) {
      this.buildObstacle(obstacle);
    }
  }

  private getMaterial(materialName: string): CANNON.Material {
    switch (materialName) {
      case "sand":
        return this.physics.sandMaterial;
      case "ice":
        return this.physics.iceMaterial;
      case "rubber":
        return this.physics.rubberMaterial;
      default:
        return this.physics.grassMaterial;
    }
  }

  private buildSurface(surface: Surface) {
    const material = this.getMaterial(surface.material);
    this.physics.addStaticBox(
      surface.position,
      surface.size,
      surface.rotation,
      material,
    );
  }

  private buildWall(wall: Wall) {
    this.physics.addStaticBox(
      wall.position,
      wall.size,
      wall.rotation,
      this.physics.wallMaterial,
    );
  }

  private buildObstacle(obstacle: Obstacle) {
    // For now, obstacles are static boxes. Moving obstacles (windmill, spinner)
    // will be added in Phase 3 with animation loops.
    const scale = obstacle.scale || { x: 1, y: 1, z: 1 };
    this.physics.addStaticBox(
      obstacle.position,
      { x: scale.x * 0.5, y: scale.y * 0.5, z: scale.z * 0.5 },
      obstacle.rotation,
      this.physics.wallMaterial,
    );
  }

  getHoleDetector(hole: Hole) {
    const hx = hole.holePosition.x;
    const hy = hole.holePosition.y;
    const hz = hole.holePosition.z;
    const radius = HOLE_RADIUS;

    return (
      ballX: number,
      ballY: number,
      ballZ: number,
      velocity: number,
    ): boolean => {
      const dx = ballX - hx;
      const dz = ballZ - hz;
      const dist = Math.sqrt(dx * dx + dz * dz);
      // Ball must be close to hole horizontally, near ground level, and not too fast
      // Use a generous radius so the ball doesn't just roll over the hole
      return (
        dist < radius * 1.8 && Math.abs(ballY - hy) < 0.15 && velocity < 1.0
      );
    };
  }
}
