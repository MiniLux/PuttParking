import * as THREE from 'three';
import type { Hole, Surface, Wall, Obstacle } from '@putt-parking/shared';
import { HOLE_RADIUS } from '@putt-parking/shared';

export class CourseRenderer {
  private scene: THREE.Scene;
  private meshes: THREE.Object3D[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  buildHole(hole: Hole) {
    this.clear();

    for (const surface of hole.surfaces) {
      this.buildSurface(surface);
    }
    for (const wall of hole.walls) {
      this.buildWall(wall);
    }
    for (const obstacle of hole.obstacles) {
      this.buildObstacle(obstacle);
    }

    // Hole marker (dark circle on ground)
    this.buildHoleMarker(hole.holePosition);

    // Tee marker
    this.buildTeeMarker(hole.teePosition);
  }

  private buildSurface(surface: Surface) {
    const geometry = new THREE.BoxGeometry(surface.size.x, surface.size.y, surface.size.z);
    const color = surface.color || this.getSurfaceColor(surface.material);
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: surface.material === 'ice' ? 0.1 : 0.8,
      metalness: surface.material === 'ice' ? 0.3 : 0,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(surface.position.x, surface.position.y, surface.position.z);
    if (surface.rotation) {
      mesh.rotation.set(surface.rotation.x, surface.rotation.y, surface.rotation.z);
    }
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.meshes.push(mesh);
  }

  private buildWall(wall: Wall) {
    const geometry = new THREE.BoxGeometry(wall.size.x, wall.size.y, wall.size.z);
    const color = wall.color || this.getWallColor(wall.material);
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.7,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(wall.position.x, wall.position.y, wall.position.z);
    if (wall.rotation) {
      mesh.rotation.set(wall.rotation.x, wall.rotation.y, wall.rotation.z);
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.meshes.push(mesh);
  }

  private buildObstacle(obstacle: Obstacle) {
    const scale = obstacle.scale || { x: 0.5, y: 0.5, z: 0.5 };
    let mesh: THREE.Mesh;

    if (obstacle.type === 'bumper') {
      const geometry = new THREE.CylinderGeometry(scale.x / 2, scale.x / 2, scale.y, 16);
      const material = new THREE.MeshStandardMaterial({
        color: obstacle.color || '#FF6B6B',
        roughness: 0.3,
        metalness: 0.2,
      });
      mesh = new THREE.Mesh(geometry, material);
    } else if (obstacle.type === 'windmill') {
      // Windmill base
      const baseGeom = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 8);
      const baseMat = new THREE.MeshStandardMaterial({ color: '#8B4513' });
      const base = new THREE.Mesh(baseGeom, baseMat);
      base.position.set(obstacle.position.x, obstacle.position.y + 0.25, obstacle.position.z);
      base.castShadow = true;
      this.scene.add(base);
      this.meshes.push(base);

      // Windmill blade (will be animated)
      const bladeGeom = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
      const bladeMat = new THREE.MeshStandardMaterial({ color: '#D32F2F' });
      mesh = new THREE.Mesh(bladeGeom, bladeMat);
      mesh.userData.isWindmill = true;
      mesh.userData.speed = obstacle.properties?.speed || 2;
    } else {
      const geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
      const material = new THREE.MeshStandardMaterial({
        color: obstacle.color || '#888888',
        roughness: 0.5,
      });
      mesh = new THREE.Mesh(geometry, material);
    }

    mesh.position.set(obstacle.position.x, obstacle.position.y + (scale.y / 2), obstacle.position.z);
    if (obstacle.rotation) {
      mesh.rotation.set(obstacle.rotation.x, obstacle.rotation.y, obstacle.rotation.z);
    }
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.meshes.push(mesh);
  }

  private buildHoleMarker(position: { x: number; y: number; z: number }) {
    // Dark circle for the hole
    const geometry = new THREE.CylinderGeometry(HOLE_RADIUS, HOLE_RADIUS, 0.01, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y + 0.01, position.z);
    this.scene.add(mesh);
    this.meshes.push(mesh);

    // Flag pole
    const poleGeom = new THREE.CylinderGeometry(0.005, 0.005, 0.3, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: '#cccccc' });
    const pole = new THREE.Mesh(poleGeom, poleMat);
    pole.position.set(position.x, position.y + 0.15, position.z);
    this.scene.add(pole);
    this.meshes.push(pole);

    // Flag
    const flagGeom = new THREE.PlaneGeometry(0.08, 0.05);
    const flagMat = new THREE.MeshStandardMaterial({
      color: '#FF4444',
      side: THREE.DoubleSide,
    });
    const flag = new THREE.Mesh(flagGeom, flagMat);
    flag.position.set(position.x + 0.04, position.y + 0.28, position.z);
    this.scene.add(flag);
    this.meshes.push(flag);
  }

  private buildTeeMarker(position: { x: number; y: number; z: number }) {
    const geometry = new THREE.CylinderGeometry(0.04, 0.04, 0.005, 16);
    const material = new THREE.MeshStandardMaterial({ color: '#ffffff' });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y + 0.005, position.z);
    this.scene.add(mesh);
    this.meshes.push(mesh);
  }

  private getSurfaceColor(material: string): string {
    switch (material) {
      case 'grass': return '#2d8a4e';
      case 'sand': return '#f4d03f';
      case 'ice': return '#b3e5fc';
      case 'rubber': return '#e74c3c';
      default: return '#2d8a4e';
    }
  }

  private getWallColor(material: string): string {
    switch (material) {
      case 'wood': return '#8B4513';
      case 'stone': return '#808080';
      case 'rubber': return '#e74c3c';
      default: return '#8B4513';
    }
  }

  update(dt: number) {
    // Animate windmills
    for (const mesh of this.meshes) {
      if (mesh.userData.isWindmill) {
        mesh.rotation.y += mesh.userData.speed * dt;
      }
    }
  }

  clear() {
    for (const mesh of this.meshes) {
      this.scene.remove(mesh);
      if (mesh instanceof THREE.Mesh) {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    }
    this.meshes = [];
  }
}
