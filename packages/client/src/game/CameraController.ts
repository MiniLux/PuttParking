import * as THREE from 'three';

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private target = new THREE.Vector3(0, 0, 0);
  private offset = new THREE.Vector3(0, 3, -3);
  private lookTarget = new THREE.Vector3();

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  setTarget(position: THREE.Vector3) {
    this.target.copy(position);
  }

  /** Show overview of the full hole */
  showOverview(teePosition: { x: number; y: number; z: number }, holePosition: { x: number; y: number; z: number }) {
    const midX = (teePosition.x + holePosition.x) / 2;
    const midZ = (teePosition.z + holePosition.z) / 2;
    const dist = Math.sqrt(
      (holePosition.x - teePosition.x) ** 2 +
      (holePosition.z - teePosition.z) ** 2
    );
    const height = Math.max(3, dist * 0.8);

    this.target.set(midX, 0, midZ);
    this.offset.set(0, height, -height * 0.4);
  }

  /** Follow the player's ball */
  followBall(ballPosition: THREE.Vector3) {
    this.target.lerp(ballPosition, 0.05);
  }

  update(dt: number) {
    const desiredPos = this.target.clone().add(this.offset);
    this.camera.position.lerp(desiredPos, 1 - Math.pow(0.01, dt));

    this.lookTarget.lerp(this.target, 1 - Math.pow(0.01, dt));
    this.camera.lookAt(this.lookTarget);
  }
}
