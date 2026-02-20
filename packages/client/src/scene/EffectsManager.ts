import * as THREE from "three";

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

export class EffectsManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private fogActive = false;
  private earthquakeActive = false;
  private earthquakeIntensity = 0;
  private fogOverlay: HTMLDivElement | null = null;
  private particles: Particle[] = [];
  private holeInActive = false;
  private holeInTime = 0;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.scene = scene;
    this.camera = camera;
  }

  setFog(active: boolean) {
    this.fogActive = active;
    if (active) {
      this.scene.fog = new THREE.FogExp2(0xcccccc, 0.8);
      if (!this.fogOverlay) {
        this.fogOverlay = document.createElement("div");
        this.fogOverlay.style.cssText = `
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse at center, transparent 20%, rgba(200,200,200,0.6) 100%);
          pointer-events: none; transition: opacity 0.5s;
        `;
        document.getElementById("ui-overlay")!.appendChild(this.fogOverlay);
      }
      this.fogOverlay.style.opacity = "1";
    } else {
      this.scene.fog = null;
      if (this.fogOverlay) {
        this.fogOverlay.style.opacity = "0";
        setTimeout(() => {
          this.fogOverlay?.remove();
          this.fogOverlay = null;
        }, 500);
      }
    }
  }

  setEarthquake(active: boolean) {
    this.earthquakeActive = active;
    if (active) {
      this.earthquakeIntensity = 0.03;
    } else {
      this.earthquakeIntensity = 0;
    }
  }

  triggerHoleIn() {
    this.holeInActive = true;
    this.holeInTime = 0;

    // Spawn celebration particles
    const colors = [0xffd700, 0x4caf50, 0x2196f3, 0xff6b6b, 0xe040fb];
    for (let i = 0; i < 30; i++) {
      const geometry = new THREE.SphereGeometry(0.008, 6, 6);
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);

      // Position at camera lookAt target roughly
      mesh.position.copy(this.camera.position);
      mesh.position.y -= 1;
      mesh.position.x += (Math.random() - 0.5) * 0.5;
      mesh.position.z += (Math.random() - 0.5) * 0.5;

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        1 + Math.random() * 2,
        (Math.random() - 0.5) * 2,
      );

      this.scene.add(mesh);
      this.particles.push({
        mesh,
        velocity,
        life: 0,
        maxLife: 1.5 + Math.random(),
      });
    }
  }

  spawnSparkle(x: number, y: number, z: number, color: number) {
    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.SphereGeometry(0.005, 4, 4);
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        0.5 + Math.random() * 0.8,
        (Math.random() - 0.5) * 0.8,
      );

      this.scene.add(mesh);
      this.particles.push({
        mesh,
        velocity,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
      });
    }
  }

  update(dt: number) {
    if (this.earthquakeActive) {
      const shakeX = (Math.random() - 0.5) * this.earthquakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.earthquakeIntensity;
      this.camera.position.x += shakeX;
      this.camera.position.y += shakeY;
    }

    if (this.holeInActive) {
      this.holeInTime += dt;
      if (this.holeInTime > 2.5) {
        this.holeInActive = false;
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;

      if (p.life >= p.maxLife) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
        this.particles.splice(i, 1);
        continue;
      }

      p.velocity.y -= 3 * dt; // gravity
      p.mesh.position.addScaledVector(p.velocity, dt);

      const alpha = 1 - p.life / p.maxLife;
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = alpha;
    }
  }

  clear() {
    this.setFog(false);
    this.setEarthquake(false);
    this.holeInActive = false;

    for (const p of this.particles) {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
    }
    this.particles = [];
  }
}
