import * as THREE from "three";
import type { CameraController } from "./CameraController.js";

export interface PuttInput {
  dirX: number;
  dirZ: number;
  power: number;
}

export class InputManager {
  private canvas: HTMLCanvasElement;
  private camera: THREE.PerspectiveCamera;
  private cameraController: CameraController | null = null;
  private raycaster = new THREE.Raycaster();
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  // Putt drag state
  private isPuttDragging = false;
  private dragStart = new THREE.Vector3();
  private dragCurrent = new THREE.Vector3();
  private maxDragDistance = 2;

  // Camera drag state
  private isCameraDragging = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private cameraSensitivity = 0.005;

  private aimArrow: HTMLDivElement | null = null;
  private powerBar: HTMLDivElement | null = null;
  private powerFill: HTMLDivElement | null = null;

  private canPutt = false;
  private ballPosition = new THREE.Vector3();
  private onPuttCallback: ((input: PuttInput) => void) | null = null;

  constructor(canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera) {
    this.canvas = canvas;
    this.camera = camera;

    this.createUI();

    canvas.addEventListener("pointerdown", (e) => this.onPointerDown(e));
    canvas.addEventListener("pointermove", (e) => this.onPointerMove(e));
    canvas.addEventListener("pointerup", (e) => this.onPointerUp(e));
    canvas.addEventListener("pointerleave", () => this.onPointerCancel());
    canvas.addEventListener("wheel", (e) => this.onWheel(e), {
      passive: false,
    });
  }

  setCameraController(controller: CameraController) {
    this.cameraController = controller;
  }

  private createUI() {
    const overlay = document.getElementById("ui-overlay")!;

    // Aim arrow
    this.aimArrow = document.createElement("div");
    this.aimArrow.style.cssText = `
      position: absolute; display: none; pointer-events: none;
      width: 4px; background: linear-gradient(to top, #4CAF50, #FFEB3B, #F44336);
      transform-origin: bottom center; border-radius: 2px;
    `;
    overlay.appendChild(this.aimArrow);

    // Power bar
    this.powerBar = document.createElement("div");
    this.powerBar.style.cssText = `
      position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
      width: 200px; height: 16px; background: rgba(0,0,0,0.5);
      border-radius: 8px; overflow: hidden; display: none;
      border: 2px solid rgba(255,255,255,0.3);
    `;
    this.powerFill = document.createElement("div");
    this.powerFill.style.cssText = `
      height: 100%; width: 0%; border-radius: 6px;
      background: linear-gradient(to right, #4CAF50, #FFEB3B, #F44336);
      transition: width 0.05s;
    `;
    this.powerBar.appendChild(this.powerFill);
    overlay.appendChild(this.powerBar);
  }

  onPutt(callback: (input: PuttInput) => void) {
    this.onPuttCallback = callback;
  }

  setCanPutt(canPutt: boolean) {
    this.canPutt = canPutt;
  }

  setBallPosition(position: THREE.Vector3) {
    this.ballPosition.copy(position);
  }

  private screenToGround(event: PointerEvent): THREE.Vector3 | null {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    const intersection = new THREE.Vector3();
    const hit = this.raycaster.ray.intersectPlane(
      this.groundPlane,
      intersection,
    );
    return hit ? intersection : null;
  }

  private isNearBall(event: PointerEvent): boolean {
    const worldPos = this.screenToGround(event);
    if (!worldPos) return false;
    return worldPos.distanceTo(this.ballPosition) < 0.5;
  }

  private onPointerDown(event: PointerEvent) {
    // If near ball and can putt → start putt drag
    if (this.canPutt && this.isNearBall(event)) {
      const worldPos = this.screenToGround(event)!;
      this.isPuttDragging = true;
      this.dragStart.copy(worldPos);
      this.dragCurrent.copy(worldPos);
      this.canvas.style.cursor = "grabbing";
      if (this.powerBar) this.powerBar.style.display = "block";
      return;
    }

    // Otherwise → camera orbit drag
    this.isCameraDragging = true;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
    this.canvas.style.cursor = "move";
  }

  private onPointerMove(event: PointerEvent) {
    if (this.isPuttDragging) {
      const worldPos = this.screenToGround(event);
      if (!worldPos) return;
      this.dragCurrent.copy(worldPos);
      this.updateAimVisuals();
      return;
    }

    if (this.isCameraDragging && this.cameraController) {
      const dx = event.clientX - this.lastPointerX;
      const dy = event.clientY - this.lastPointerY;
      this.lastPointerX = event.clientX;
      this.lastPointerY = event.clientY;

      this.cameraController.rotate(
        -dx * this.cameraSensitivity,
        dy * this.cameraSensitivity,
      );
    }
  }

  private onPointerUp(_event: PointerEvent) {
    if (this.isPuttDragging) {
      this.isPuttDragging = false;
      this.canvas.style.cursor = "default";

      const dx = this.dragStart.x - this.dragCurrent.x;
      const dz = this.dragStart.z - this.dragCurrent.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 0.05 && this.onPuttCallback) {
        const power = Math.min(dist / this.maxDragDistance, 1);
        const len = Math.sqrt(dx * dx + dz * dz);
        this.onPuttCallback({
          dirX: dx / len,
          dirZ: dz / len,
          power,
        });
      }

      this.hideAimVisuals();
      return;
    }

    if (this.isCameraDragging) {
      this.isCameraDragging = false;
      this.canvas.style.cursor = "default";
    }
  }

  private onPointerCancel() {
    if (this.isPuttDragging) {
      this.isPuttDragging = false;
      this.canvas.style.cursor = "default";
      this.hideAimVisuals();
    }
    if (this.isCameraDragging) {
      this.isCameraDragging = false;
      this.canvas.style.cursor = "default";
    }
  }

  private onWheel(event: WheelEvent) {
    event.preventDefault();
    if (this.cameraController) {
      this.cameraController.zoom(event.deltaY * 0.005);
    }
  }

  private updateAimVisuals() {
    const dx = this.dragStart.x - this.dragCurrent.x;
    const dz = this.dragStart.z - this.dragCurrent.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const power = Math.min(dist / this.maxDragDistance, 1);

    // Update power bar
    if (this.powerFill) {
      this.powerFill.style.width = `${power * 100}%`;
    }

    // Update aim arrow (project ball position to screen)
    if (this.aimArrow) {
      const ballScreen = this.ballPosition.clone().project(this.camera);
      const rect = this.canvas.getBoundingClientRect();
      const screenX = (ballScreen.x * 0.5 + 0.5) * rect.width;
      const screenY = (-ballScreen.y * 0.5 + 0.5) * rect.height;

      const arrowLength = Math.min(power * 100, 100);
      const angle = Math.atan2(-dx, -dz);

      this.aimArrow.style.display = "block";
      this.aimArrow.style.left = `${screenX}px`;
      this.aimArrow.style.top = `${screenY - arrowLength}px`;
      this.aimArrow.style.height = `${arrowLength}px`;
      this.aimArrow.style.transform = `translateX(-50%) rotate(${-angle}rad)`;
    }
  }

  private hideAimVisuals() {
    if (this.aimArrow) this.aimArrow.style.display = "none";
    if (this.powerBar) this.powerBar.style.display = "none";
  }
}
