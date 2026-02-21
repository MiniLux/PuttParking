import type { GameStateSyncData, PlayerSyncData } from '@putt-parking/shared';

type Callback = (value: any) => void;

export class StateManager {
  private currentState: GameStateSyncData | null = null;
  private stateCallbacks = new Map<string, Callback[]>();
  private playerCallbacks = new Map<string, Map<string, Callback[]>>();
  private playerAddCallbacks: Array<
    (player: PlayerSyncData, sessionId: string) => void
  > = [];
  private playerRemoveCallbacks: Array<
    (player: PlayerSyncData, sessionId: string) => void
  > = [];
  private ballSyncCallbacks: Array<
    (balls: Record<string, { x: number; y: number; z: number }>) => void
  > = [];

  listenState(field: string, cb: Callback) {
    if (!this.stateCallbacks.has(field)) this.stateCallbacks.set(field, []);
    this.stateCallbacks.get(field)!.push(cb);
    // Fire immediately if we have state
    if (this.currentState) {
      cb((this.currentState as any)[field]);
    }
  }

  listenPlayer(sessionId: string, field: string, cb: Callback) {
    if (!this.playerCallbacks.has(sessionId))
      this.playerCallbacks.set(sessionId, new Map());
    const pMap = this.playerCallbacks.get(sessionId)!;
    if (!pMap.has(field)) pMap.set(field, []);
    pMap.get(field)!.push(cb);
  }

  onAdd(cb: (player: PlayerSyncData, sessionId: string) => void) {
    this.playerAddCallbacks.push(cb);
    // Fire for existing players
    if (this.currentState) {
      for (const [sid, player] of Object.entries(this.currentState.players)) {
        cb(player, sid);
      }
    }
  }

  onRemove(cb: (player: PlayerSyncData, sessionId: string) => void) {
    this.playerRemoveCallbacks.push(cb);
  }

  onBallSync(
    cb: (balls: Record<string, { x: number; y: number; z: number }>) => void,
  ) {
    this.ballSyncCallbacks.push(cb);
  }

  handleBallSync(
    balls: Record<string, { x: number; y: number; z: number }>,
  ) {
    for (const cb of this.ballSyncCallbacks) cb(balls);
  }

  applyState(newState: GameStateSyncData) {
    const oldState = this.currentState;
    this.currentState = newState;

    if (!oldState) {
      // Initial state: fire onAdd for all existing players
      for (const [sid, player] of Object.entries(newState.players)) {
        for (const cb of this.playerAddCallbacks) cb(player, sid);
      }
      // Fire state callbacks for initial values
      for (const [field, cbs] of this.stateCallbacks) {
        for (const cb of cbs) cb((newState as any)[field]);
      }
      return;
    }

    // Diff top-level state fields
    for (const [field, cbs] of this.stateCallbacks) {
      if ((oldState as any)[field] !== (newState as any)[field]) {
        for (const cb of cbs) cb((newState as any)[field]);
      }
    }

    // Diff players: detect joins, leaves, and property changes
    const oldPlayers = oldState.players || {};
    const newPlayers = newState.players || {};

    for (const sid of Object.keys(newPlayers)) {
      if (!oldPlayers[sid]) {
        // New player joined
        for (const cb of this.playerAddCallbacks) cb(newPlayers[sid], sid);
      } else {
        // Existing player: check for property changes
        const pCallbacks = this.playerCallbacks.get(sid);
        if (pCallbacks) {
          for (const [field, cbs] of pCallbacks) {
            if (
              (oldPlayers[sid] as any)[field] !==
              (newPlayers[sid] as any)[field]
            ) {
              for (const cb of cbs) cb((newPlayers[sid] as any)[field]);
            }
          }
        }
      }
    }

    for (const sid of Object.keys(oldPlayers)) {
      if (!newPlayers[sid]) {
        // Player removed
        for (const cb of this.playerRemoveCallbacks)
          cb(oldPlayers[sid], sid);
        this.playerCallbacks.delete(sid);
      }
    }
  }

  getState(): GameStateSyncData | null {
    return this.currentState;
  }

  getPlayer(sessionId: string): PlayerSyncData | undefined {
    return this.currentState?.players?.[sessionId];
  }
}
