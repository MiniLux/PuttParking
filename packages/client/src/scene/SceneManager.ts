import * as THREE from "three";

const THEME_COLORS: Record<
  string,
  {
    sky: number;
    ambient: number;
    ambientIntensity: number;
    dirIntensity: number;
    fog?: number;
  }
> = {
  default: {
    sky: 0x87ceeb,
    ambient: 0xffffff,
    ambientIntensity: 0.6,
    dirIntensity: 0.8,
  },
  forest: {
    sky: 0x87ceeb,
    ambient: 0xf5f5dc,
    ambientIntensity: 0.6,
    dirIntensity: 0.8,
  },
  neon: {
    sky: 0x0a0020,
    ambient: 0x6600ff,
    ambientIntensity: 0.4,
    dirIntensity: 0.3,
    fog: 0x0a0020,
  },
  pirate: {
    sky: 0x5bc0de,
    ambient: 0xfff8e1,
    ambientIntensity: 0.7,
    dirIntensity: 0.9,
  },
  candy: {
    sky: 0xffc1e3,
    ambient: 0xfff0f5,
    ambientIntensity: 0.7,
    dirIntensity: 0.7,
  },
  space: {
    sky: 0x0d1b2a,
    ambient: 0x4488ff,
    ambientIntensity: 0.3,
    dirIntensity: 0.4,
    fog: 0x0d1b2a,
  },
  haunted: {
    sky: 0x1a0a2e,
    ambient: 0x8844aa,
    ambientIntensity: 0.3,
    dirIntensity: 0.3,
    fog: 0x1a0a2e,
  },
};

export class SceneManager {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;
  private currentTheme = "default";

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);

    this.camera = new THREE.PerspectiveCamera(
      60,
      canvas.clientWidth / canvas.clientHeight,
      0.01,
      100,
    );
    this.camera.position.set(0, 3, -4);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(5, 10, 5);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 50;
    this.directionalLight.shadow.camera.left = -10;
    this.directionalLight.shadow.camera.right = 10;
    this.directionalLight.shadow.camera.top = 10;
    this.directionalLight.shadow.camera.bottom = -10;
    this.scene.add(this.directionalLight);

    window.addEventListener("resize", () => this.onResize());
  }

  setTheme(theme: string) {
    if (this.currentTheme === theme) return;
    this.currentTheme = theme;

    const t = THEME_COLORS[theme] || THEME_COLORS.default;
    this.scene.background = new THREE.Color(t.sky);
    this.ambientLight.color.set(t.ambient);
    this.ambientLight.intensity = t.ambientIntensity;
    this.directionalLight.intensity = t.dirIntensity;

    if (t.fog) {
      this.scene.fog = new THREE.FogExp2(t.fog, 0.15);
    } else {
      this.scene.fog = null;
    }
  }

  private onResize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
