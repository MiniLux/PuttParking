import * as THREE from "three";

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private target = new THREE.Vector3(0, 0, 0);
  private lookTarget = new THREE.Vector3();

  // Spherical coordinates around target
  private azimuth = 0; // horizontal angle (radians)
  private elevation = 1.0; // vertical angle (radians), clamped
  private distance = 4; // distance from target

  private minElevation = 0.3;
  private maxElevation = Math.PI / 2 - 0.05;
  private minDistance = 2;
  private maxDistance = 10;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  setTarget(position: THREE.Vector3) {
    this.target.copy(position);
  }

  /** Show overview of the full hole */
  showOverview(
    teePosition: { x: number; y: number; z: number },
    holePosition: { x: number; y: number; z: number },
  ) {
    const dx = holePosition.x - teePosition.x;
    const dz = holePosition.z - teePosition.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    // Point camera towards the hole from the tee
    this.azimuth = Math.atan2(dx, dz);
    this.elevation = 0.9;
    this.distance = Math.max(4, dist * 0.9);

    const midX = (teePosition.x + holePosition.x) / 2;
    const midZ = (teePosition.z + holePosition.z) / 2;
    this.target.set(midX, 0, midZ);
  }

  /** Follow the player's ball */
  followBall(ballPosition: THREE.Vector3) {
    this.target.lerp(ballPosition, 0.05);
  }

  /** Rotate camera by delta angles (called from InputManager) */
  rotate(deltaAzimuth: number, deltaElevation: number) {
    this.azimuth += deltaAzimuth;
    this.elevation = Math.max(
      this.minElevation,
      Math.min(this.maxElevation, this.elevation + deltaElevation),
    );
  }

  /** Zoom camera in/out */
  zoom(delta: number) {
    this.distance = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, this.distance + delta),
    );
  }

  update(dt: number) {
    // Compute camera position from spherical coordinates
    const offset = new THREE.Vector3(
      this.distance * Math.sin(this.azimuth) * Math.cos(this.elevation),
      this.distance * Math.sin(this.elevation),
      this.distance * Math.cos(this.azimuth) * Math.cos(this.elevation),
    );

    const desiredPos = this.target.clone().add(offset);
    this.camera.position.lerp(desiredPos, 1 - Math.pow(0.01, dt));

    this.lookTarget.lerp(this.target, 1 - Math.pow(0.01, dt));
    this.camera.lookAt(this.lookTarget);
  }
}
