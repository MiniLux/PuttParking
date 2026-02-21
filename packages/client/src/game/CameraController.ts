import * as THREE from "three";

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private target = new THREE.Vector3(0, 0, 0);
  private lookTarget = new THREE.Vector3();

  // Spherical coordinates around target
  private azimuth = 0; // horizontal angle (radians)
  private elevation = 0.8; // vertical angle (radians), clamped
  private distance = 2; // distance from target

  private minElevation = 0.2;
  private maxElevation = Math.PI / 2 - 0.05;
  private minDistance = 1;
  private maxDistance = 6;

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

    // Place camera behind the tee, looking toward the hole
    this.azimuth = Math.atan2(-dx, -dz);
    this.elevation = 0.6;
    this.distance = 2;

    // Target the tee position so we look from behind the ball toward the hole
    this.target.set(teePosition.x, 0, teePosition.z);
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
