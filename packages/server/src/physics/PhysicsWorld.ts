import * as CANNON from 'cannon-es';
import {
  GRAVITY,
  BALL_RADIUS,
  BALL_MASS,
  BALL_LINEAR_DAMPING,
  BALL_ANGULAR_DAMPING,
  BALL_AT_REST_VELOCITY,
  BALL_AT_REST_ANGULAR,
  FRICTION_GRASS,
  RESTITUTION_GRASS,
  FRICTION_SAND,
  RESTITUTION_SAND,
  FRICTION_ICE,
  RESTITUTION_ICE,
  FRICTION_RUBBER,
  RESTITUTION_RUBBER,
} from '@putt-parking/shared';

export class PhysicsWorld {
  world: CANNON.World;
  ballMaterial: CANNON.Material;
  grassMaterial: CANNON.Material;
  sandMaterial: CANNON.Material;
  iceMaterial: CANNON.Material;
  rubberMaterial: CANNON.Material;
  wallMaterial: CANNON.Material;

  private balls = new Map<string, CANNON.Body>();
  private staticBodies: CANNON.Body[] = [];

  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, GRAVITY, 0);
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.allowSleep = true;

    // Materials
    this.ballMaterial = new CANNON.Material('ball');
    this.grassMaterial = new CANNON.Material('grass');
    this.sandMaterial = new CANNON.Material('sand');
    this.iceMaterial = new CANNON.Material('ice');
    this.rubberMaterial = new CANNON.Material('rubber');
    this.wallMaterial = new CANNON.Material('wall');

    // Contact materials
    this.world.addContactMaterial(new CANNON.ContactMaterial(
      this.ballMaterial, this.grassMaterial,
      { friction: FRICTION_GRASS, restitution: RESTITUTION_GRASS }
    ));
    this.world.addContactMaterial(new CANNON.ContactMaterial(
      this.ballMaterial, this.sandMaterial,
      { friction: FRICTION_SAND, restitution: RESTITUTION_SAND }
    ));
    this.world.addContactMaterial(new CANNON.ContactMaterial(
      this.ballMaterial, this.iceMaterial,
      { friction: FRICTION_ICE, restitution: RESTITUTION_ICE }
    ));
    this.world.addContactMaterial(new CANNON.ContactMaterial(
      this.ballMaterial, this.rubberMaterial,
      { friction: FRICTION_RUBBER, restitution: RESTITUTION_RUBBER }
    ));
    this.world.addContactMaterial(new CANNON.ContactMaterial(
      this.ballMaterial, this.wallMaterial,
      { friction: 0.1, restitution: 0.6 }
    ));
    // Ball-to-ball contact
    this.world.addContactMaterial(new CANNON.ContactMaterial(
      this.ballMaterial, this.ballMaterial,
      { friction: 0.3, restitution: 0.5 }
    ));
  }

  addBall(id: string, x: number, y: number, z: number): CANNON.Body {
    const shape = new CANNON.Sphere(BALL_RADIUS);
    const body = new CANNON.Body({
      mass: BALL_MASS,
      shape,
      material: this.ballMaterial,
      linearDamping: BALL_LINEAR_DAMPING,
      angularDamping: BALL_ANGULAR_DAMPING,
      position: new CANNON.Vec3(x, y, z),
    });
    body.sleepSpeedLimit = BALL_AT_REST_VELOCITY;
    body.sleepTimeLimit = 0.5;
    this.world.addBody(body);
    this.balls.set(id, body);
    return body;
  }

  removeBall(id: string) {
    const body = this.balls.get(id);
    if (body) {
      this.world.removeBody(body);
      this.balls.delete(id);
    }
  }

  getBall(id: string): CANNON.Body | undefined {
    return this.balls.get(id);
  }

  isBallAtRest(id: string): boolean {
    const body = this.balls.get(id);
    if (!body) return true;
    return (
      body.velocity.length() < BALL_AT_REST_VELOCITY &&
      body.angularVelocity.length() < BALL_AT_REST_ANGULAR
    );
  }

  applyPutt(id: string, dirX: number, dirZ: number, power: number) {
    const body = this.balls.get(id);
    if (!body) return;
    // Wake up the body
    body.wakeUp();
    const impulse = new CANNON.Vec3(dirX * power, 0, dirZ * power);
    body.applyImpulse(impulse);
  }

  setBallPosition(id: string, x: number, y: number, z: number) {
    const body = this.balls.get(id);
    if (!body) return;
    body.position.set(x, y, z);
    body.velocity.set(0, 0, 0);
    body.angularVelocity.set(0, 0, 0);
    body.wakeUp();
  }

  addStaticBox(
    position: { x: number; y: number; z: number },
    size: { x: number; y: number; z: number },
    rotation?: { x: number; y: number; z: number },
    material?: CANNON.Material
  ): CANNON.Body {
    const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
    const body = new CANNON.Body({
      mass: 0,
      shape,
      material: material || this.grassMaterial,
      position: new CANNON.Vec3(position.x, position.y, position.z),
    });
    if (rotation) {
      body.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);
    }
    this.world.addBody(body);
    this.staticBodies.push(body);
    return body;
  }

  clearStatic() {
    for (const body of this.staticBodies) {
      this.world.removeBody(body);
    }
    this.staticBodies = [];
  }

  step(dt: number) {
    this.world.step(1 / 60, dt, 3);
  }

  getBallPositions(): Map<string, { x: number; y: number; z: number }> {
    const positions = new Map();
    for (const [id, body] of this.balls) {
      positions.set(id, {
        x: body.position.x,
        y: body.position.y,
        z: body.position.z,
      });
    }
    return positions;
  }
}
