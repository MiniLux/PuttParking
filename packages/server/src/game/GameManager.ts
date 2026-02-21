import type { RoomAdapter } from "../RoomAdapter.js";
import type { PlayerData } from "../state/GameState.js";
import { PhysicsWorld } from "../physics/PhysicsWorld.js";
import { CourseBuilder } from "../physics/CourseBuilder.js";
import { BallController } from "../physics/BallController.js";
import {
  HOLE_TIME_LIMIT,
  HOLE_REVIEW_TIME,
  HOLES_PER_COURSE,
  MAX_STROKES_PER_HOLE,
  TICK_RATE,
  NETWORK_RATE,
} from "@putt-parking/shared";
import type { Hole, Course } from "@putt-parking/shared";
import { PowerUpManager } from "./PowerUpManager.js";

export class GameManager {
  private room: RoomAdapter;
  private physics: PhysicsWorld;
  private courseBuilder: CourseBuilder;
  private ballController: BallController;
  private powerUpManager: PowerUpManager;
  private currentCourse: Course | null = null;
  private currentHole: Hole | null = null;
  private holeDetector:
    | ((x: number, y: number, z: number, v: number) => boolean)
    | null = null;
  private physicsInterval: ReturnType<typeof setInterval> | null = null;
  private networkInterval: ReturnType<typeof setInterval> | null = null;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private previousPositions = new Map<
    string,
    { x: number; y: number; z: number }
  >();

  // Tournament mode
  private tournamentCourses: Course[] = [];
  private tournamentCourseIndex = 0;
  private isTournament = false;

  constructor(room: RoomAdapter) {
    this.room = room;
    this.physics = new PhysicsWorld();
    this.courseBuilder = new CourseBuilder(this.physics);
    this.ballController = new BallController(this.physics);
    this.powerUpManager = new PowerUpManager(this.room, this.physics);
  }

  startGame(course: Course) {
    this.isTournament = false;
    this.currentCourse = course;
    this.room.state.courseId = course.id;
    this.room.state.currentHole = 0;
    this.room.state.courseIndex = 0;
    this.room.state.totalCourses = 1;
    this.room.state.gameMode = "casual";
    this.startHole(0);
  }

  startTournament(courses: Course[]) {
    this.isTournament = true;
    this.tournamentCourses = courses;
    this.tournamentCourseIndex = 0;
    this.room.state.gameMode = "tournament";
    this.room.state.totalCourses = courses.length;
    this.room.state.courseIndex = 0;

    for (const [, player] of Object.entries(this.room.state.players)) {
      if (!player.isSpectator) {
        player.totalStrokes = 0;
      }
    }

    this.startTournamentCourse(0);
  }

  private startTournamentCourse(index: number) {
    if (index >= this.tournamentCourses.length) {
      this.endTournament();
      return;
    }
    this.tournamentCourseIndex = index;
    this.currentCourse = this.tournamentCourses[index];
    this.room.state.courseId = this.currentCourse.id;
    this.room.state.courseIndex = index;
    this.room.state.currentHole = 0;
    this.startHole(0);
  }

  private startHole(holeIndex: number) {
    if (!this.currentCourse) return;
    if (holeIndex >= this.currentCourse.holes.length) {
      this.endCourse();
      return;
    }

    this.currentHole = this.currentCourse.holes[holeIndex];
    this.room.state.currentHole = holeIndex;
    this.room.state.phase = "playing";
    this.room.state.holeTimeRemaining = HOLE_TIME_LIMIT;

    // Build physics for this hole
    this.courseBuilder.buildHole(this.currentHole);
    this.holeDetector = this.courseBuilder.getHoleDetector(this.currentHole);

    // Place all player balls at the tee
    for (const [sessionId, player] of Object.entries(this.room.state.players)) {
      if (player.isSpectator) continue;
      player.strokes = 0;
      player.hasFinishedHole = false;
      player.isBallAtRest = true;

      const tee = this.currentHole!.teePosition;
      const offset = player.colorIndex * 0.05;
      const x = tee.x + offset;
      const y = tee.y + 0.05;
      const z = tee.z;

      this.physics.removeBall(sessionId);
      this.physics.addBall(sessionId, x, y, z);
      player.ballX = x;
      player.ballY = y;
      player.ballZ = z;
    }

    this.previousPositions.clear();

    // Spawn power-ups for this hole
    this.powerUpManager.spawnForHole(this.currentHole);

    // Start physics loop
    this.startPhysicsLoop();

    // Start hole timer
    this.startTimer();

    this.room.broadcast("hole_start", {
      holeIndex,
      par: this.currentHole.par,
      teePosition: this.currentHole.teePosition,
      holePosition: this.currentHole.holePosition,
    });

    this.room.broadcastState();
  }

  private startPhysicsLoop() {
    this.stopPhysicsLoop();

    let lastTime = Date.now();

    this.physicsInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastTime) / 1000;
      lastTime = now;

      this.physics.step(elapsed);
      this.powerUpManager.update();
      this.updateBallStates();
    }, 1000 / TICK_RATE);

    // Network sync at lower rate
    this.networkInterval = setInterval(() => {
      this.syncBallPositions();
    }, 1000 / NETWORK_RATE);
  }

  private stopPhysicsLoop() {
    if (this.physicsInterval) {
      clearInterval(this.physicsInterval);
      this.physicsInterval = null;
    }
    if (this.networkInterval) {
      clearInterval(this.networkInterval);
      this.networkInterval = null;
    }
  }

  private startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.room.state.holeTimeRemaining--;
      this.room.broadcastState();
      if (this.room.state.holeTimeRemaining <= 0) {
        this.endHole();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /** Stop all loops (used when resetting room) */
  stopAll() {
    this.stopPhysicsLoop();
    this.stopTimer();
  }

  private updateBallStates() {
    if (!this.currentHole || !this.holeDetector) return;

    for (const [sessionId, player] of Object.entries(this.room.state.players)) {
      if (player.isSpectator || player.hasFinishedHole) continue;

      const ball = this.physics.getBall(sessionId);
      if (!ball) continue;

      const atRest = this.physics.isBallAtRest(sessionId);
      player.isBallAtRest = atRest;

      // Check power-up pickups
      this.powerUpManager.checkPickups(
        sessionId,
        ball.position.x,
        ball.position.z,
      );

      // Check if ball fell off the course
      if (ball.position.y < -2) {
        const prev = this.previousPositions.get(sessionId);
        const pos = prev || this.currentHole!.teePosition;
        this.physics.setBallPosition(sessionId, pos.x, pos.y + 0.05, pos.z);
        player.strokes++;
      }

      // Store position when ball is at rest (for out-of-bounds reset)
      if (atRest && ball.position.y > -1) {
        this.previousPositions.set(sessionId, {
          x: ball.position.x,
          y: ball.position.y,
          z: ball.position.z,
        });
      }

      // Check hole-in
      const velocity = ball.velocity.length();
      if (
        this.holeDetector!(
          ball.position.x,
          ball.position.y,
          ball.position.z,
          velocity,
        )
      ) {
        player.hasFinishedHole = true;
        player.isBallAtRest = true;
        this.physics.setBallPosition(sessionId, 0, -10, 0);

        this.room.broadcast("hole_in", {
          playerId: sessionId,
          username: player.username,
          strokes: player.strokes,
        });

        this.checkAllFinished();
      }

      // Check max strokes
      if (player.strokes >= MAX_STROKES_PER_HOLE && atRest) {
        player.hasFinishedHole = true;
        this.physics.setBallPosition(sessionId, 0, -10, 0);
        this.checkAllFinished();
      }
    }
  }

  private syncBallPositions() {
    const balls: Record<string, { x: number; y: number; z: number }> = {};

    for (const [sessionId, player] of Object.entries(this.room.state.players)) {
      if (player.isSpectator || player.hasFinishedHole) continue;
      const ball = this.physics.getBall(sessionId);
      if (!ball) continue;
      player.ballX = ball.position.x;
      player.ballY = ball.position.y;
      player.ballZ = ball.position.z;
      balls[sessionId] = {
        x: ball.position.x,
        y: ball.position.y,
        z: ball.position.z,
      };
    }

    this.room.broadcast("ball_sync", { balls });
  }

  private checkAllFinished() {
    let allDone = true;
    for (const [, player] of Object.entries(this.room.state.players)) {
      if (!player.isSpectator && !player.hasFinishedHole) {
        allDone = false;
        break;
      }
    }
    if (allDone) {
      this.endHole();
    }
  }

  private endHole() {
    this.stopPhysicsLoop();
    this.stopTimer();

    // Add strokes to total - unfinished players get max strokes
    for (const [, player] of Object.entries(this.room.state.players)) {
      if (player.isSpectator) continue;
      if (!player.hasFinishedHole) {
        player.strokes = MAX_STROKES_PER_HOLE;
        player.hasFinishedHole = true;
      }
      player.totalStrokes += player.strokes;
    }

    this.room.state.phase = "hole_review";

    // Build leaderboard
    const scores: Array<{
      sessionId: string;
      username: string;
      strokes: number;
      total: number;
    }> = [];
    for (const [sessionId, player] of Object.entries(this.room.state.players)) {
      if (player.isSpectator) continue;
      scores.push({
        sessionId,
        username: player.username,
        strokes: player.strokes,
        total: player.totalStrokes,
      });
    }
    scores.sort((a, b) => a.total - b.total);

    this.room.broadcast("hole_end", {
      holeIndex: this.room.state.currentHole,
      par: this.currentHole?.par || 3,
      scores,
    });

    this.room.broadcastState();

    // After review period, start next hole
    setTimeout(() => {
      const nextHole = this.room.state.currentHole + 1;
      if (nextHole < (this.currentCourse?.holes.length || HOLES_PER_COURSE)) {
        this.startHole(nextHole);
      } else {
        this.endCourse();
      }
    }, HOLE_REVIEW_TIME * 1000);
  }

  private endCourse() {
    this.stopPhysicsLoop();
    this.stopTimer();
    this.room.state.phase = "course_end";

    const scores: Array<{
      sessionId: string;
      username: string;
      total: number;
    }> = [];
    for (const [sessionId, player] of Object.entries(this.room.state.players)) {
      if (player.isSpectator) continue;
      scores.push({
        sessionId,
        username: player.username,
        total: player.totalStrokes,
      });
    }
    scores.sort((a, b) => a.total - b.total);

    this.room.broadcast("course_end", {
      scores,
      isTournament: this.isTournament,
      courseIndex: this.tournamentCourseIndex,
      totalCourses: this.tournamentCourses.length,
    });

    this.room.broadcastState();

    if (this.isTournament) {
      setTimeout(() => {
        this.startTournamentCourse(this.tournamentCourseIndex + 1);
      }, HOLE_REVIEW_TIME * 1000);
    }
  }

  private endTournament() {
    this.stopPhysicsLoop();
    this.stopTimer();
    this.room.state.phase = "tournament_end";

    const scores: Array<{
      sessionId: string;
      username: string;
      total: number;
    }> = [];
    for (const [sessionId, player] of Object.entries(this.room.state.players)) {
      if (player.isSpectator) continue;
      scores.push({
        sessionId,
        username: player.username,
        total: player.totalStrokes,
      });
    }
    scores.sort((a, b) => a.total - b.total);

    this.room.broadcast("tournament_end", { scores });
    this.room.broadcastState();
  }

  handlePutt(sessionId: string, dirX: number, dirZ: number, power: number) {
    const player = this.room.getPlayer(sessionId);
    if (
      !player ||
      player.isSpectator ||
      !player.isBallAtRest ||
      player.hasFinishedHole
    )
      return;
    if (this.room.state.phase !== "playing") return;

    player.strokes++;
    player.isBallAtRest = false;

    // Apply modifiers
    let multiplier = 1;
    let actualDirX = dirX;
    let actualDirZ = dirZ;

    if (player.hasPowerShot) {
      multiplier = 1.5;
      player.hasPowerShot = false;
    }
    if (player.hasReversiball) {
      actualDirX = -actualDirX;
      actualDirZ = -actualDirZ;
      player.hasReversiball = false;
    }

    this.ballController.putt(
      sessionId,
      actualDirX,
      actualDirZ,
      power,
      multiplier,
    );
  }

  handleUsePowerUp(
    sessionId: string,
    powerUpId: string,
    targetPlayerId?: string,
  ) {
    if (powerUpId === "rewind") {
      const prev = this.previousPositions.get(sessionId);
      if (prev) {
        this.physics.setBallPosition(sessionId, prev.x, prev.y + 0.05, prev.z);
        const player = this.room.getPlayer(sessionId);
        if (player && player.strokes > 0) {
          player.strokes--;
        }
      }
    }
    this.powerUpManager.usePowerUp(sessionId, powerUpId, targetPlayerId);
  }

  dispose() {
    this.stopPhysicsLoop();
    this.stopTimer();
    this.powerUpManager.clearAll();
  }
}
