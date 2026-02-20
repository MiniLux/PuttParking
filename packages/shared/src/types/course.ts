export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Surface {
  type: 'flat' | 'ramp' | 'curve' | 'halfpipe';
  position: Vec3;
  size: Vec3;
  rotation?: Vec3;
  material: 'grass' | 'sand' | 'ice' | 'rubber';
  color?: string;
}

export interface Wall {
  position: Vec3;
  size: Vec3;
  rotation?: Vec3;
  material: 'wood' | 'stone' | 'rubber';
  color?: string;
}

export interface Obstacle {
  type: 'windmill' | 'bumper' | 'ramp' | 'loop' | 'spinner' | 'conveyor' | 'bridge';
  position: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
  properties?: Record<string, number>;
  color?: string;
}

export interface PowerUpSpawn {
  position: Vec3;
}

export interface Zone {
  position: Vec3;
  size: Vec3;
  rotation?: Vec3;
}

export interface Hole {
  id: number;
  par: number;
  teePosition: Vec3;
  holePosition: Vec3;
  surfaces: Surface[];
  walls: Wall[];
  obstacles: Obstacle[];
  powerUpSpawns: PowerUpSpawn[];
  waterHazards: Zone[];
  outOfBounds: Zone[];
}

export interface Course {
  id: string;
  name: string;
  theme: string;
  description: string;
  holes: Hole[];
}
