import { Schema, type, ArraySchema } from '@colyseus/schema';

export class PlayerState extends Schema {
  @type('string') discordId: string = '';
  @type('string') username: string = '';
  @type('string') avatarUrl: string = '';
  @type('number') ballX: number = 0;
  @type('number') ballY: number = 0;
  @type('number') ballZ: number = 0;
  @type('number') ballRadius: number = 0.02;
  @type('number') strokes: number = 0;
  @type('number') totalStrokes: number = 0;
  @type('boolean') hasFinishedHole: boolean = false;
  @type('boolean') isReady: boolean = false;
  @type('boolean') isSpectator: boolean = false;
  @type('boolean') isBallAtRest: boolean = true;
  @type('number') colorIndex: number = 0;
  @type(['string']) powerUps = new ArraySchema<string>();

  // Active effects (client reads these for visual effects)
  @type('boolean') hasSteadyAim: boolean = false;
  @type('boolean') hasPowerShot: boolean = false;
  @type('boolean') hasMagnet: boolean = false;
  @type('boolean') hasGhostBall: boolean = false;
  @type('boolean') hasSuperSize: boolean = false;
  @type('boolean') hasFunSize: boolean = false;
  @type('boolean') hasIceRink: boolean = false;
  @type('boolean') hasReversiball: boolean = false;
  @type('boolean') hasTwistedAim: boolean = false;
  @type('boolean') hasZanyball: boolean = false;
  @type('boolean') hasFog: boolean = false;
  @type('boolean') hasEarthquake: boolean = false;
}
