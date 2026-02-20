import { Schema, type, MapSchema } from '@colyseus/schema';
import { PlayerState } from './PlayerState.js';

export class GameState extends Schema {
  @type('string') phase: string = 'lobby';
  @type('string') gameMode: string = 'casual';
  @type('string') courseId: string = '';
  @type('number') currentHole: number = 0;
  @type('number') holeTimeRemaining: number = 60;
  @type('number') courseIndex: number = 0;
  @type('number') totalCourses: number = 1;
  @type('string') hostId: string = '';
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}
