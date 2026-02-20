import * as THREE from 'three';
import { POWERUP_CATALOG } from '@putt-parking/shared';

interface SpawnedPickup {
  id: string;
  powerUpId: string;
  mesh: THREE.Mesh;
}

export class PowerUpRenderer {
  private scene: THREE.Scene;
  private pickups: SpawnedPickup[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  spawnPickups(data: Array<{ id: string; powerUpId: string; x: number; y: number; z: number }>) {
    this.clear();

    for (const item of data) {
      const def = POWERUP_CATALOG.find(p => p.id === item.powerUpId);
      const color = def?.color || '#ffffff';

      // Floating diamond shape for pickups
      const geometry = new THREE.OctahedronGeometry(0.04, 0);
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(item.x, item.y + 0.08, item.z);
      mesh.castShadow = true;
      this.scene.add(mesh);

      this.pickups.push({ id: item.id, powerUpId: item.powerUpId, mesh });
    }
  }

  removePickup(spawnId: string) {
    const idx = this.pickups.findIndex(p => p.id === spawnId);
    if (idx !== -1) {
      const pickup = this.pickups[idx];
      this.scene.remove(pickup.mesh);
      pickup.mesh.geometry.dispose();
      (pickup.mesh.material as THREE.Material).dispose();
      this.pickups.splice(idx, 1);
    }
  }

  update(dt: number) {
    // Animate pickups: float and rotate
    const time = performance.now() / 1000;
    for (const pickup of this.pickups) {
      pickup.mesh.rotation.y += dt * 2;
      pickup.mesh.position.y = pickup.mesh.position.y + Math.sin(time * 3) * 0.0005;
    }
  }

  clear() {
    for (const pickup of this.pickups) {
      this.scene.remove(pickup.mesh);
      pickup.mesh.geometry.dispose();
      (pickup.mesh.material as THREE.Material).dispose();
    }
    this.pickups = [];
  }
}
