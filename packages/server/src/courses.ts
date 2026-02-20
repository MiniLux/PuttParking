import type { Course } from "@putt-parking/shared";

// Courses are defined here on the server side for now.
// In Phase 3 they'll move to shared JSON files.

const windmillWoods: Course = {
  id: "windmill-woods",
  name: "Windmill Woods",
  theme: "forest",
  description: "A gentle forest course with classic mini-golf obstacles.",
  holes: [
    // Hole 1: Straight shot (par 2)
    {
      id: 1,
      par: 2,
      teePosition: { x: 0, y: 0, z: -2 },
      holePosition: { x: 0, y: 0, z: 2 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "grass",
          color: "#2d8a4e",
        },
      ],
      walls: [
        // Left wall
        {
          position: { x: -0.65, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "wood",
          color: "#8B4513",
        },
        // Right wall
        {
          position: { x: 0.65, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "wood",
          color: "#8B4513",
        },
        // Back wall
        {
          position: { x: 0, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
        // Front wall (behind hole)
        {
          position: { x: 0, y: 0.1, z: 2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 0 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    // Hole 2: L-shaped bend (par 3)
    {
      id: 2,
      par: 3,
      teePosition: { x: -1.5, y: 0, z: -2 },
      holePosition: { x: 1.5, y: 0, z: 2 },
      surfaces: [
        // Vertical section
        {
          type: "flat",
          position: { x: -1.5, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "grass",
          color: "#2d8a4e",
        },
        // Corner
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 2 },
          size: { x: 2.4, y: 0.1, z: 1.2 },
          material: "grass",
          color: "#2d8a4e",
        },
        // Horizontal section
        {
          type: "flat",
          position: { x: 1.5, y: -0.05, z: 2 },
          size: { x: 1.2, y: 0.1, z: 1.2 },
          material: "grass",
          color: "#2d8a4e",
        },
      ],
      walls: [
        // Left wall of vertical section
        {
          position: { x: -2.15, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "wood",
          color: "#8B4513",
        },
        // Right wall of vertical section (stops at corner)
        {
          position: { x: -0.85, y: 0.1, z: -0.75 },
          size: { x: 0.1, y: 0.3, z: 3.5 },
          material: "wood",
          color: "#8B4513",
        },
        // Back wall
        {
          position: { x: -1.5, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
        // Bottom wall of corner
        {
          position: { x: -0.25, y: 0.1, z: 1.35 },
          size: { x: 1.3, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
        // Top wall
        {
          position: { x: 0, y: 0.1, z: 2.65 },
          size: { x: 4.4, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
        // Right wall of horizontal section
        {
          position: { x: 2.15, y: 0.1, z: 2 },
          size: { x: 0.1, y: 0.3, z: 1.4 },
          material: "wood",
          color: "#8B4513",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: -1.5, y: 0.1, z: 1 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    // Hole 3: Uphill ramp (par 3)
    {
      id: 3,
      par: 3,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0.5, z: 3 },
      surfaces: [
        // Flat start
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: -2 },
          size: { x: 1.2, y: 0.1, z: 2.5 },
          material: "grass",
          color: "#2d8a4e",
        },
        // Ramp
        {
          type: "ramp",
          position: { x: 0, y: 0.22, z: 0.5 },
          size: { x: 1.2, y: 0.1, z: 2.5 },
          rotation: { x: -0.2, y: 0, z: 0 },
          material: "grass",
          color: "#3a9d5e",
        },
        // Flat top
        {
          type: "flat",
          position: { x: 0, y: 0.45, z: 3 },
          size: { x: 1.2, y: 0.1, z: 2.5 },
          material: "grass",
          color: "#2d8a4e",
        },
      ],
      walls: [
        {
          position: { x: -0.65, y: 0.3, z: 0 },
          size: { x: 0.1, y: 0.8, z: 7 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: 0.65, y: 0.3, z: 0 },
          size: { x: 0.1, y: 0.8, z: 7 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: 0, y: 0.3, z: -3.55 },
          size: { x: 1.4, y: 0.8, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: 0, y: 0.6, z: 4.3 },
          size: { x: 1.4, y: 0.8, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.3, z: 0 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    // Hole 4: Windmill obstacle (par 4)
    {
      id: 4,
      par: 4,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 1.5, y: 0.1, z: 7 },
          material: "grass",
          color: "#2d8a4e",
        },
      ],
      walls: [
        {
          position: { x: -0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: 0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
      ],
      obstacles: [
        {
          type: "windmill",
          position: { x: 0, y: 0, z: 0 },
          scale: { x: 1.5, y: 0.3, z: 0.1 },
          properties: { speed: 2 },
        },
      ],
      powerUpSpawns: [
        { position: { x: 0, y: 0.1, z: -1.5 } },
        { position: { x: 0, y: 0.1, z: 1.5 } },
      ],
      waterHazards: [],
      outOfBounds: [],
    },
    // Hole 5: Narrow with bumpers (par 4)
    {
      id: 5,
      par: 4,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 2, y: 0.1, z: 7 },
          material: "grass",
          color: "#2d8a4e",
        },
      ],
      walls: [
        {
          position: { x: -1.05, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: 1.05, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 2.2, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 2.2, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
      ],
      obstacles: [
        {
          type: "bumper",
          position: { x: -0.4, y: 0.05, z: -1 },
          scale: { x: 0.3, y: 0.2, z: 0.3 },
          color: "#FF6B6B",
        },
        {
          type: "bumper",
          position: { x: 0.4, y: 0.05, z: 0 },
          scale: { x: 0.3, y: 0.2, z: 0.3 },
          color: "#FF6B6B",
        },
        {
          type: "bumper",
          position: { x: -0.3, y: 0.05, z: 1 },
          scale: { x: 0.3, y: 0.2, z: 0.3 },
          color: "#FF6B6B",
        },
        {
          type: "bumper",
          position: { x: 0.5, y: 0.05, z: 2 },
          scale: { x: 0.3, y: 0.2, z: 0.3 },
          color: "#FF6B6B",
        },
      ],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 0.5 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    // Hole 6: S-curve with sand trap (par 5)
    {
      id: 6,
      par: 5,
      teePosition: { x: -1, y: 0, z: -3 },
      holePosition: { x: 1, y: 0, z: 3 },
      surfaces: [
        // Start section
        {
          type: "flat",
          position: { x: -1, y: -0.05, z: -2 },
          size: { x: 1.2, y: 0.1, z: 2.5 },
          material: "grass",
          color: "#2d8a4e",
        },
        // Middle crossover
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 3.2, y: 0.1, z: 1.5 },
          material: "grass",
          color: "#2d8a4e",
        },
        // Sand trap in middle
        {
          type: "flat",
          position: { x: 0, y: -0.06, z: 0 },
          size: { x: 0.8, y: 0.08, z: 0.8 },
          material: "sand",
          color: "#f4d03f",
        },
        // End section
        {
          type: "flat",
          position: { x: 1, y: -0.05, z: 2 },
          size: { x: 1.2, y: 0.1, z: 2.5 },
          material: "grass",
          color: "#2d8a4e",
        },
      ],
      walls: [
        // Start section walls
        {
          position: { x: -1.65, y: 0.1, z: -2 },
          size: { x: 0.1, y: 0.3, z: 2.5 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: -0.35, y: 0.1, z: -2 },
          size: { x: 0.1, y: 0.3, z: 1.75 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: -1, y: 0.1, z: -3.3 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
        // Middle section walls
        {
          position: { x: 0, y: 0.1, z: -0.8 },
          size: { x: 3.4, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: 0, y: 0.1, z: 0.8 },
          size: { x: 3.4, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
        // End section walls
        {
          position: { x: 0.35, y: 0.1, z: 2 },
          size: { x: 0.1, y: 0.3, z: 1.75 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: 1.65, y: 0.1, z: 2 },
          size: { x: 0.1, y: 0.3, z: 2.5 },
          material: "wood",
          color: "#8B4513",
        },
        {
          position: { x: 1, y: 0.1, z: 3.3 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#8B4513",
        },
      ],
      obstacles: [],
      powerUpSpawns: [
        { position: { x: -1, y: 0.1, z: -1 } },
        { position: { x: 1, y: 0.1, z: 1 } },
      ],
      waterHazards: [],
      outOfBounds: [],
    },
  ],
};

// ==================== Neon Nights ====================
const neonNights: Course = {
  id: "neon-nights",
  name: "Neon Nights",
  theme: "neon",
  description: "A glowing neon-lit course with bouncy walls and ice patches.",
  holes: [
    {
      id: 1,
      par: 2,
      teePosition: { x: 0, y: 0, z: -2 },
      holePosition: { x: 0, y: 0, z: 2 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 1.4, y: 0.1, z: 5 },
          material: "grass",
          color: "#1a1a2e",
        },
      ],
      walls: [
        {
          position: { x: -0.75, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "rubber",
          color: "#ff00ff",
        },
        {
          position: { x: 0.75, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "rubber",
          color: "#00ffff",
        },
        {
          position: { x: 0, y: 0.1, z: -2.55 },
          size: { x: 1.6, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ff00ff",
        },
        {
          position: { x: 0, y: 0.1, z: 2.55 },
          size: { x: 1.6, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#00ffff",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 0 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 2,
      par: 3,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: -1.5 },
          size: { x: 1.4, y: 0.1, z: 3.5 },
          material: "grass",
          color: "#1a1a2e",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 2 },
          size: { x: 1.4, y: 0.1, z: 2.5 },
          material: "ice",
          color: "#4a90d9",
        },
      ],
      walls: [
        {
          position: { x: -0.75, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "rubber",
          color: "#ff00ff",
        },
        {
          position: { x: 0.75, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "rubber",
          color: "#00ffff",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 1.6, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ff00ff",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 1.6, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#00ffff",
        },
      ],
      obstacles: [
        {
          type: "bumper",
          position: { x: -0.3, y: 0.05, z: 0 },
          scale: { x: 0.25, y: 0.2, z: 0.25 },
          color: "#ff6600",
        },
        {
          type: "bumper",
          position: { x: 0.3, y: 0.05, z: 0.8 },
          scale: { x: 0.25, y: 0.2, z: 0.25 },
          color: "#ff6600",
        },
      ],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: -1 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 3,
      par: 3,
      teePosition: { x: -1.5, y: 0, z: -2 },
      holePosition: { x: 1.5, y: 0, z: -2 },
      surfaces: [
        {
          type: "flat",
          position: { x: -1.5, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "grass",
          color: "#1a1a2e",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 2 },
          size: { x: 2.4, y: 0.1, z: 1.2 },
          material: "grass",
          color: "#1a1a2e",
        },
        {
          type: "flat",
          position: { x: 1.5, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "grass",
          color: "#1a1a2e",
        },
      ],
      walls: [
        {
          position: { x: -2.15, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "rubber",
          color: "#ff00ff",
        },
        {
          position: { x: -0.85, y: 0.1, z: -0.5 },
          size: { x: 0.1, y: 0.3, z: 4 },
          material: "rubber",
          color: "#00ffff",
        },
        {
          position: { x: 0.85, y: 0.1, z: -0.5 },
          size: { x: 0.1, y: 0.3, z: 4 },
          material: "rubber",
          color: "#ff00ff",
        },
        {
          position: { x: 2.15, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "rubber",
          color: "#00ffff",
        },
        {
          position: { x: -1.5, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ff6600",
        },
        {
          position: { x: 1.5, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ff6600",
        },
        {
          position: { x: 0, y: 0.1, z: 2.65 },
          size: { x: 4.4, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ff6600",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 2 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 4,
      par: 4,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 2, y: 0.1, z: 7 },
          material: "grass",
          color: "#1a1a2e",
        },
      ],
      walls: [
        {
          position: { x: -1.05, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "rubber",
          color: "#ff00ff",
        },
        {
          position: { x: 1.05, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "rubber",
          color: "#00ffff",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 2.2, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ff6600",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 2.2, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ff6600",
        },
        // Inner zigzag walls
        {
          position: { x: -0.5, y: 0.1, z: -1.5 },
          size: { x: 0.8, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ffff00",
        },
        {
          position: { x: 0.5, y: 0.1, z: 0 },
          size: { x: 0.8, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ffff00",
        },
        {
          position: { x: -0.5, y: 0.1, z: 1.5 },
          size: { x: 0.8, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ffff00",
        },
      ],
      obstacles: [],
      powerUpSpawns: [
        { position: { x: 0, y: 0.1, z: -0.75 } },
        { position: { x: 0, y: 0.1, z: 0.75 } },
      ],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 5,
      par: 4,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 1.5, y: 0.1, z: 7 },
          material: "grass",
          color: "#1a1a2e",
        },
      ],
      walls: [
        {
          position: { x: -0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "rubber",
          color: "#ff00ff",
        },
        {
          position: { x: 0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "rubber",
          color: "#00ffff",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ff6600",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ff6600",
        },
      ],
      obstacles: [
        {
          type: "bumper",
          position: { x: -0.3, y: 0.05, z: -2 },
          scale: { x: 0.2, y: 0.2, z: 0.2 },
          color: "#ff6600",
        },
        {
          type: "bumper",
          position: { x: 0.3, y: 0.05, z: -1 },
          scale: { x: 0.2, y: 0.2, z: 0.2 },
          color: "#ff6600",
        },
        {
          type: "bumper",
          position: { x: 0, y: 0.05, z: 0 },
          scale: { x: 0.3, y: 0.2, z: 0.3 },
          color: "#ff00ff",
        },
        {
          type: "bumper",
          position: { x: -0.3, y: 0.05, z: 1 },
          scale: { x: 0.2, y: 0.2, z: 0.2 },
          color: "#ff6600",
        },
        {
          type: "bumper",
          position: { x: 0.3, y: 0.05, z: 2 },
          scale: { x: 0.2, y: 0.2, z: 0.2 },
          color: "#ff6600",
        },
      ],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 0.5 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 6,
      par: 5,
      teePosition: { x: 0, y: 0, z: -4 },
      holePosition: { x: 0, y: 0, z: 4 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: -2.5 },
          size: { x: 1.4, y: 0.1, z: 3.5 },
          material: "grass",
          color: "#1a1a2e",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0.5 },
          size: { x: 2.5, y: 0.1, z: 2 },
          material: "ice",
          color: "#4a90d9",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 3 },
          size: { x: 1.4, y: 0.1, z: 2.5 },
          material: "grass",
          color: "#1a1a2e",
        },
      ],
      walls: [
        {
          position: { x: -0.75, y: 0.1, z: -2.5 },
          size: { x: 0.1, y: 0.3, z: 3.5 },
          material: "rubber",
          color: "#ff00ff",
        },
        {
          position: { x: 0.75, y: 0.1, z: -2.5 },
          size: { x: 0.1, y: 0.3, z: 3.5 },
          material: "rubber",
          color: "#00ffff",
        },
        {
          position: { x: -1.3, y: 0.1, z: 0.5 },
          size: { x: 0.1, y: 0.3, z: 2 },
          material: "rubber",
          color: "#ff00ff",
        },
        {
          position: { x: 1.3, y: 0.1, z: 0.5 },
          size: { x: 0.1, y: 0.3, z: 2 },
          material: "rubber",
          color: "#00ffff",
        },
        {
          position: { x: -0.75, y: 0.1, z: 3 },
          size: { x: 0.1, y: 0.3, z: 2.5 },
          material: "rubber",
          color: "#ff00ff",
        },
        {
          position: { x: 0.75, y: 0.1, z: 3 },
          size: { x: 0.1, y: 0.3, z: 2.5 },
          material: "rubber",
          color: "#00ffff",
        },
        {
          position: { x: 0, y: 0.1, z: -4.3 },
          size: { x: 1.6, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ff6600",
        },
        {
          position: { x: 0, y: 0.1, z: 4.3 },
          size: { x: 1.6, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#ff6600",
        },
      ],
      obstacles: [
        {
          type: "bumper",
          position: { x: -0.5, y: 0.05, z: 0.5 },
          scale: { x: 0.25, y: 0.2, z: 0.25 },
          color: "#ff6600",
        },
        {
          type: "bumper",
          position: { x: 0.5, y: 0.05, z: 0.5 },
          scale: { x: 0.25, y: 0.2, z: 0.25 },
          color: "#ff6600",
        },
      ],
      powerUpSpawns: [
        { position: { x: 0, y: 0.1, z: -1 } },
        { position: { x: 0, y: 0.1, z: 2 } },
      ],
      waterHazards: [],
      outOfBounds: [],
    },
  ],
};

// ==================== Pirate Cove ====================
const pirateCove: Course = {
  id: "pirate-cove",
  name: "Pirate Cove",
  theme: "pirate",
  description: "Navigate treacherous waters and sandy shores.",
  holes: [
    {
      id: 1,
      par: 2,
      teePosition: { x: 0, y: 0, z: -2 },
      holePosition: { x: 0, y: 0, z: 2 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "sand",
          color: "#f4d03f",
        },
      ],
      walls: [
        {
          position: { x: -0.65, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0.65, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0, y: 0.1, z: 2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 0 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 2,
      par: 3,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: -1.5 },
          size: { x: 1.5, y: 0.1, z: 3.5 },
          material: "sand",
          color: "#f4d03f",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 2 },
          size: { x: 1.5, y: 0.1, z: 2.5 },
          material: "grass",
          color: "#2d8a4e",
        },
      ],
      walls: [
        {
          position: { x: -0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
      ],
      obstacles: [
        {
          type: "bumper",
          position: { x: -0.3, y: 0.05, z: -0.5 },
          scale: { x: 0.2, y: 0.15, z: 0.2 },
          color: "#795548",
        },
        {
          type: "bumper",
          position: { x: 0.3, y: 0.05, z: 0.5 },
          scale: { x: 0.2, y: 0.15, z: 0.2 },
          color: "#795548",
        },
      ],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 1 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 3,
      par: 3,
      teePosition: { x: -1.5, y: 0, z: -2 },
      holePosition: { x: 1.5, y: 0, z: 2 },
      surfaces: [
        {
          type: "flat",
          position: { x: -1.5, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "sand",
          color: "#f4d03f",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 2 },
          size: { x: 2.4, y: 0.1, z: 1.2 },
          material: "sand",
          color: "#f4d03f",
        },
        {
          type: "flat",
          position: { x: 1.5, y: -0.05, z: 2 },
          size: { x: 1.2, y: 0.1, z: 1.2 },
          material: "grass",
          color: "#2d8a4e",
        },
      ],
      walls: [
        {
          position: { x: -2.15, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: -0.85, y: 0.1, z: -0.75 },
          size: { x: 0.1, y: 0.3, z: 3.5 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: -1.5, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0, y: 0.1, z: 1.35 },
          size: { x: 1.3, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0, y: 0.1, z: 2.65 },
          size: { x: 4.4, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 2.15, y: 0.1, z: 2 },
          size: { x: 0.1, y: 0.3, z: 1.4 },
          material: "wood",
          color: "#5D4037",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: -1.5, y: 0.1, z: 1 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 4,
      par: 4,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 2, y: 0.1, z: 7 },
          material: "sand",
          color: "#f4d03f",
        },
      ],
      walls: [
        {
          position: { x: -1.05, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 1.05, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 2.2, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 2.2, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
        // Central obstacle walls
        {
          position: { x: -0.4, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 1.5 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0.4, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 1.5 },
          material: "wood",
          color: "#5D4037",
        },
      ],
      obstacles: [],
      powerUpSpawns: [
        { position: { x: -0.7, y: 0.1, z: 0 } },
        { position: { x: 0.7, y: 0.1, z: 0 } },
      ],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 5,
      par: 4,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0.5, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: -2 },
          size: { x: 1.5, y: 0.1, z: 2.5 },
          material: "sand",
          color: "#f4d03f",
        },
        {
          type: "ramp",
          position: { x: 0, y: 0.22, z: 0.5 },
          size: { x: 1.5, y: 0.1, z: 2.5 },
          rotation: { x: -0.2, y: 0, z: 0 },
          material: "sand",
          color: "#e6c32f",
        },
        {
          type: "flat",
          position: { x: 0, y: 0.45, z: 3 },
          size: { x: 1.5, y: 0.1, z: 2.5 },
          material: "grass",
          color: "#2d8a4e",
        },
      ],
      walls: [
        {
          position: { x: -0.8, y: 0.3, z: 0 },
          size: { x: 0.1, y: 0.8, z: 7 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0.8, y: 0.3, z: 0 },
          size: { x: 0.1, y: 0.8, z: 7 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0, y: 0.3, z: -3.55 },
          size: { x: 1.7, y: 0.8, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0, y: 0.6, z: 4.3 },
          size: { x: 1.7, y: 0.8, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.3, z: 0 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 6,
      par: 5,
      teePosition: { x: 0, y: 0, z: -4 },
      holePosition: { x: 0, y: 0, z: 4 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: -2.5 },
          size: { x: 1.5, y: 0.1, z: 3.5 },
          material: "sand",
          color: "#f4d03f",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 1 },
          size: { x: 2.5, y: 0.1, z: 2 },
          material: "sand",
          color: "#f4d03f",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 3.5 },
          size: { x: 1.5, y: 0.1, z: 1.5 },
          material: "grass",
          color: "#2d8a4e",
        },
      ],
      walls: [
        {
          position: { x: -0.8, y: 0.1, z: -2.5 },
          size: { x: 0.1, y: 0.3, z: 3.5 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0.8, y: 0.1, z: -2.5 },
          size: { x: 0.1, y: 0.3, z: 3.5 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: -1.3, y: 0.1, z: 1 },
          size: { x: 0.1, y: 0.3, z: 2 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 1.3, y: 0.1, z: 1 },
          size: { x: 0.1, y: 0.3, z: 2 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: -0.8, y: 0.1, z: 3.5 },
          size: { x: 0.1, y: 0.3, z: 1.5 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0.8, y: 0.1, z: 3.5 },
          size: { x: 0.1, y: 0.3, z: 1.5 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0, y: 0.1, z: -4.3 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
        {
          position: { x: 0, y: 0.1, z: 4.3 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "wood",
          color: "#5D4037",
        },
      ],
      obstacles: [
        {
          type: "bumper",
          position: { x: -0.5, y: 0.05, z: 1 },
          scale: { x: 0.2, y: 0.15, z: 0.2 },
          color: "#795548",
        },
        {
          type: "bumper",
          position: { x: 0.5, y: 0.05, z: 1 },
          scale: { x: 0.2, y: 0.15, z: 0.2 },
          color: "#795548",
        },
        {
          type: "bumper",
          position: { x: 0, y: 0.05, z: 1.5 },
          scale: { x: 0.2, y: 0.15, z: 0.2 },
          color: "#795548",
        },
      ],
      powerUpSpawns: [
        { position: { x: 0, y: 0.1, z: -1 } },
        { position: { x: 0, y: 0.1, z: 2.5 } },
      ],
      waterHazards: [],
      outOfBounds: [],
    },
  ],
};

// ==================== Candy Land ====================
const candyLand: Course = {
  id: "candy-land",
  name: "Candy Land",
  theme: "candy",
  description:
    "A sweet course full of bouncy gummy bumpers and slippery frosting.",
  holes: [
    {
      id: 1,
      par: 2,
      teePosition: { x: 0, y: 0, z: -2 },
      holePosition: { x: 0, y: 0, z: 2 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "grass",
          color: "#FFB6C1",
        },
      ],
      walls: [
        {
          position: { x: -0.65, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 0.65, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "rubber",
          color: "#DDA0DD",
        },
        {
          position: { x: 0, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 0, y: 0.1, z: 2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#DDA0DD",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 0 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 2,
      par: 3,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 1.5, y: 0.1, z: 7 },
          material: "grass",
          color: "#FFB6C1",
        },
      ],
      walls: [
        {
          position: { x: -0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "rubber",
          color: "#DDA0DD",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#DDA0DD",
        },
      ],
      obstacles: [
        {
          type: "bumper",
          position: { x: -0.3, y: 0.05, z: -1 },
          scale: { x: 0.25, y: 0.2, z: 0.25 },
          color: "#FF1493",
        },
        {
          type: "bumper",
          position: { x: 0.3, y: 0.05, z: 0 },
          scale: { x: 0.25, y: 0.2, z: 0.25 },
          color: "#FF4500",
        },
        {
          type: "bumper",
          position: { x: -0.3, y: 0.05, z: 1 },
          scale: { x: 0.25, y: 0.2, z: 0.25 },
          color: "#32CD32",
        },
      ],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: -2 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 3,
      par: 3,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: -1.5 },
          size: { x: 1.5, y: 0.1, z: 3.5 },
          material: "grass",
          color: "#FFB6C1",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 2 },
          size: { x: 1.5, y: 0.1, z: 2.5 },
          material: "ice",
          color: "#E0FFFF",
        },
      ],
      walls: [
        {
          position: { x: -0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "rubber",
          color: "#DDA0DD",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#DDA0DD",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 0.5 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 4,
      par: 4,
      teePosition: { x: -1.5, y: 0, z: -2 },
      holePosition: { x: 1.5, y: 0, z: 2 },
      surfaces: [
        {
          type: "flat",
          position: { x: -1.5, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "grass",
          color: "#FFB6C1",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 2 },
          size: { x: 2.4, y: 0.1, z: 1.2 },
          material: "ice",
          color: "#E0FFFF",
        },
        {
          type: "flat",
          position: { x: 1.5, y: -0.05, z: 2 },
          size: { x: 1.2, y: 0.1, z: 1.2 },
          material: "grass",
          color: "#FFB6C1",
        },
      ],
      walls: [
        {
          position: { x: -2.15, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: -0.85, y: 0.1, z: -0.75 },
          size: { x: 0.1, y: 0.3, z: 3.5 },
          material: "rubber",
          color: "#DDA0DD",
        },
        {
          position: { x: -1.5, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 0, y: 0.1, z: 1.35 },
          size: { x: 1.3, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 0, y: 0.1, z: 2.65 },
          size: { x: 4.4, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#DDA0DD",
        },
        {
          position: { x: 2.15, y: 0.1, z: 2 },
          size: { x: 0.1, y: 0.3, z: 1.4 },
          material: "rubber",
          color: "#DDA0DD",
        },
      ],
      obstacles: [
        {
          type: "bumper",
          position: { x: 0, y: 0.05, z: 2 },
          scale: { x: 0.3, y: 0.2, z: 0.3 },
          color: "#FF1493",
        },
      ],
      powerUpSpawns: [{ position: { x: -1.5, y: 0.1, z: 1 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 5,
      par: 4,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 2, y: 0.1, z: 7 },
          material: "grass",
          color: "#FFB6C1",
        },
      ],
      walls: [
        {
          position: { x: -1.05, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 1.05, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "rubber",
          color: "#DDA0DD",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 2.2, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 2.2, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#DDA0DD",
        },
      ],
      obstacles: [
        {
          type: "bumper",
          position: { x: -0.5, y: 0.05, z: -1.5 },
          scale: { x: 0.3, y: 0.25, z: 0.3 },
          color: "#FF1493",
        },
        {
          type: "bumper",
          position: { x: 0.5, y: 0.05, z: -0.5 },
          scale: { x: 0.3, y: 0.25, z: 0.3 },
          color: "#32CD32",
        },
        {
          type: "bumper",
          position: { x: -0.5, y: 0.05, z: 0.5 },
          scale: { x: 0.3, y: 0.25, z: 0.3 },
          color: "#FF4500",
        },
        {
          type: "bumper",
          position: { x: 0.5, y: 0.05, z: 1.5 },
          scale: { x: 0.3, y: 0.25, z: 0.3 },
          color: "#9932CC",
        },
      ],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 0 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 6,
      par: 5,
      teePosition: { x: 0, y: 0, z: -4 },
      holePosition: { x: 0, y: 0, z: 4 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: -2 },
          size: { x: 1.5, y: 0.1, z: 4.5 },
          material: "grass",
          color: "#FFB6C1",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 2 },
          size: { x: 2.5, y: 0.1, z: 3.5 },
          material: "ice",
          color: "#E0FFFF",
        },
      ],
      walls: [
        {
          position: { x: -0.8, y: 0.1, z: -2 },
          size: { x: 0.1, y: 0.3, z: 4.5 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 0.8, y: 0.1, z: -2 },
          size: { x: 0.1, y: 0.3, z: 4.5 },
          material: "rubber",
          color: "#DDA0DD",
        },
        {
          position: { x: -1.3, y: 0.1, z: 2 },
          size: { x: 0.1, y: 0.3, z: 3.5 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 1.3, y: 0.1, z: 2 },
          size: { x: 0.1, y: 0.3, z: 3.5 },
          material: "rubber",
          color: "#DDA0DD",
        },
        {
          position: { x: 0, y: 0.1, z: -4.3 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#FF69B4",
        },
        {
          position: { x: 0, y: 0.1, z: 4.3 },
          size: { x: 2.7, y: 0.3, z: 0.1 },
          material: "rubber",
          color: "#DDA0DD",
        },
      ],
      obstacles: [
        {
          type: "bumper",
          position: { x: -0.6, y: 0.05, z: 1.5 },
          scale: { x: 0.2, y: 0.2, z: 0.2 },
          color: "#FF1493",
        },
        {
          type: "bumper",
          position: { x: 0.6, y: 0.05, z: 2 },
          scale: { x: 0.2, y: 0.2, z: 0.2 },
          color: "#32CD32",
        },
        {
          type: "bumper",
          position: { x: 0, y: 0.05, z: 2.5 },
          scale: { x: 0.2, y: 0.2, z: 0.2 },
          color: "#FF4500",
        },
      ],
      powerUpSpawns: [
        { position: { x: 0, y: 0.1, z: -1 } },
        { position: { x: 0, y: 0.1, z: 3 } },
      ],
      waterHazards: [],
      outOfBounds: [],
    },
  ],
};

// ==================== Space Station ====================
const spaceStation: Course = {
  id: "space-station",
  name: "Space Station",
  theme: "space",
  description: "Low-friction metallic surfaces in zero-G corridors.",
  holes: [
    {
      id: 1,
      par: 2,
      teePosition: { x: 0, y: 0, z: -2 },
      holePosition: { x: 0, y: 0, z: 2 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "ice",
          color: "#37474F",
        },
      ],
      walls: [
        {
          position: { x: -0.65, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0.65, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0, y: 0.1, z: 2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 0 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 2,
      par: 3,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 1.5, y: 0.1, z: 7 },
          material: "ice",
          color: "#37474F",
        },
      ],
      walls: [
        {
          position: { x: -0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
        // Corridor narrowing
        {
          position: { x: -0.3, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 1 },
          material: "stone",
          color: "#78909C",
        },
        {
          position: { x: 0.3, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 1 },
          material: "stone",
          color: "#78909C",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: -1.5 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 3,
      par: 3,
      teePosition: { x: -1.5, y: 0, z: -2 },
      holePosition: { x: 1.5, y: 0, z: -2 },
      surfaces: [
        {
          type: "flat",
          position: { x: -1.5, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "ice",
          color: "#37474F",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 2 },
          size: { x: 2.4, y: 0.1, z: 1.2 },
          material: "ice",
          color: "#37474F",
        },
        {
          type: "flat",
          position: { x: 1.5, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "ice",
          color: "#37474F",
        },
      ],
      walls: [
        {
          position: { x: -2.15, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: -0.85, y: 0.1, z: -0.5 },
          size: { x: 0.1, y: 0.3, z: 4 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0.85, y: 0.1, z: -0.5 },
          size: { x: 0.1, y: 0.3, z: 4 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 2.15, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: -1.5, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 1.5, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0, y: 0.1, z: 2.65 },
          size: { x: 4.4, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 2 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 4,
      par: 4,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 2, y: 0.1, z: 7 },
          material: "ice",
          color: "#37474F",
        },
      ],
      walls: [
        {
          position: { x: -1.05, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 1.05, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 2.2, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 2.2, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
      ],
      obstacles: [
        {
          type: "bumper",
          position: { x: -0.4, y: 0.05, z: -1 },
          scale: { x: 0.3, y: 0.2, z: 0.3 },
          color: "#00BCD4",
        },
        {
          type: "bumper",
          position: { x: 0.4, y: 0.05, z: 0.5 },
          scale: { x: 0.3, y: 0.2, z: 0.3 },
          color: "#00BCD4",
        },
        {
          type: "bumper",
          position: { x: 0, y: 0.05, z: 2 },
          scale: { x: 0.3, y: 0.2, z: 0.3 },
          color: "#00BCD4",
        },
      ],
      powerUpSpawns: [
        { position: { x: 0, y: 0.1, z: -2 } },
        { position: { x: 0, y: 0.1, z: 1 } },
      ],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 5,
      par: 4,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0.5, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: -2 },
          size: { x: 1.5, y: 0.1, z: 2.5 },
          material: "ice",
          color: "#37474F",
        },
        {
          type: "ramp",
          position: { x: 0, y: 0.22, z: 0.5 },
          size: { x: 1.5, y: 0.1, z: 2.5 },
          rotation: { x: -0.2, y: 0, z: 0 },
          material: "ice",
          color: "#455A64",
        },
        {
          type: "flat",
          position: { x: 0, y: 0.45, z: 3 },
          size: { x: 1.5, y: 0.1, z: 2.5 },
          material: "ice",
          color: "#37474F",
        },
      ],
      walls: [
        {
          position: { x: -0.8, y: 0.3, z: 0 },
          size: { x: 0.1, y: 0.8, z: 7 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0.8, y: 0.3, z: 0 },
          size: { x: 0.1, y: 0.8, z: 7 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0, y: 0.3, z: -3.55 },
          size: { x: 1.7, y: 0.8, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0, y: 0.6, z: 4.3 },
          size: { x: 1.7, y: 0.8, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.3, z: 0 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 6,
      par: 5,
      teePosition: { x: 0, y: 0, z: -4 },
      holePosition: { x: 0, y: 0, z: 4 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 2.5, y: 0.1, z: 9 },
          material: "ice",
          color: "#37474F",
        },
      ],
      walls: [
        {
          position: { x: -1.3, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 9 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 1.3, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 9 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0, y: 0.1, z: -4.55 },
          size: { x: 2.7, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
        {
          position: { x: 0, y: 0.1, z: 4.55 },
          size: { x: 2.7, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#546E7A",
        },
        // Maze walls
        {
          position: { x: -0.6, y: 0.1, z: -2.5 },
          size: { x: 1, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#78909C",
        },
        {
          position: { x: 0.6, y: 0.1, z: -1 },
          size: { x: 1, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#78909C",
        },
        {
          position: { x: -0.6, y: 0.1, z: 0.5 },
          size: { x: 1, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#78909C",
        },
        {
          position: { x: 0.6, y: 0.1, z: 2 },
          size: { x: 1, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#78909C",
        },
      ],
      obstacles: [],
      powerUpSpawns: [
        { position: { x: 0, y: 0.1, z: -1.75 } },
        { position: { x: 0, y: 0.1, z: 1.25 } },
      ],
      waterHazards: [],
      outOfBounds: [],
    },
  ],
};

// ==================== Haunted Manor ====================
const hauntedManor: Course = {
  id: "haunted-manor",
  name: "Haunted Manor",
  theme: "haunted",
  description: "Dark corridors and spooky obstacles in a decrepit mansion.",
  holes: [
    {
      id: 1,
      par: 2,
      teePosition: { x: 0, y: 0, z: -2 },
      holePosition: { x: 0, y: 0, z: 2 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "grass",
          color: "#2E2E2E",
        },
      ],
      walls: [
        {
          position: { x: -0.65, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0.65, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0, y: 0.1, z: 2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 0 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 2,
      par: 3,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 1.5, y: 0.1, z: 7 },
          material: "grass",
          color: "#2E2E2E",
        },
      ],
      walls: [
        {
          position: { x: -0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
        // Spooky pillars
        {
          position: { x: -0.3, y: 0.15, z: -1 },
          size: { x: 0.15, y: 0.3, z: 0.15 },
          material: "stone",
          color: "#616161",
        },
        {
          position: { x: 0.3, y: 0.15, z: 1 },
          size: { x: 0.15, y: 0.3, z: 0.15 },
          material: "stone",
          color: "#616161",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: 0, y: 0.1, z: 0 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 3,
      par: 3,
      teePosition: { x: -1.5, y: 0, z: -2 },
      holePosition: { x: 1.5, y: 0, z: 2 },
      surfaces: [
        {
          type: "flat",
          position: { x: -1.5, y: -0.05, z: 0 },
          size: { x: 1.2, y: 0.1, z: 5 },
          material: "grass",
          color: "#2E2E2E",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 2 },
          size: { x: 2.4, y: 0.1, z: 1.2 },
          material: "grass",
          color: "#2E2E2E",
        },
        {
          type: "flat",
          position: { x: 1.5, y: -0.05, z: 2 },
          size: { x: 1.2, y: 0.1, z: 1.2 },
          material: "grass",
          color: "#2E2E2E",
        },
      ],
      walls: [
        {
          position: { x: -2.15, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 5 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: -0.85, y: 0.1, z: -0.75 },
          size: { x: 0.1, y: 0.3, z: 3.5 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: -1.5, y: 0.1, z: -2.55 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0, y: 0.1, z: 1.35 },
          size: { x: 1.3, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0, y: 0.1, z: 2.65 },
          size: { x: 4.4, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 2.15, y: 0.1, z: 2 },
          size: { x: 0.1, y: 0.3, z: 1.4 },
          material: "stone",
          color: "#424242",
        },
      ],
      obstacles: [],
      powerUpSpawns: [{ position: { x: -1.5, y: 0.1, z: 1 } }],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 4,
      par: 4,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 2, y: 0.1, z: 7 },
          material: "grass",
          color: "#2E2E2E",
        },
      ],
      walls: [
        {
          position: { x: -1.05, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 1.05, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 2.2, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 2.2, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
        // Spooky maze
        {
          position: { x: -0.5, y: 0.1, z: -1.5 },
          size: { x: 0.8, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#616161",
        },
        {
          position: { x: 0.5, y: 0.1, z: 0 },
          size: { x: 0.8, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#616161",
        },
        {
          position: { x: -0.5, y: 0.1, z: 1.5 },
          size: { x: 0.8, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#616161",
        },
      ],
      obstacles: [],
      powerUpSpawns: [
        { position: { x: 0, y: 0.1, z: -0.75 } },
        { position: { x: 0, y: 0.1, z: 0.75 } },
      ],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 5,
      par: 4,
      teePosition: { x: 0, y: 0, z: -3 },
      holePosition: { x: 0, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0 },
          size: { x: 1.5, y: 0.1, z: 7 },
          material: "grass",
          color: "#2E2E2E",
        },
      ],
      walls: [
        {
          position: { x: -0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0.8, y: 0.1, z: 0 },
          size: { x: 0.1, y: 0.3, z: 7 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0, y: 0.1, z: -3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0, y: 0.1, z: 3.55 },
          size: { x: 1.7, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
      ],
      obstacles: [
        {
          type: "windmill",
          position: { x: 0, y: 0, z: 0 },
          scale: { x: 1.2, y: 0.25, z: 0.08 },
          properties: { speed: 1.5 },
          color: "#616161",
        },
      ],
      powerUpSpawns: [
        { position: { x: 0, y: 0.1, z: -1.5 } },
        { position: { x: 0, y: 0.1, z: 1.5 } },
      ],
      waterHazards: [],
      outOfBounds: [],
    },
    {
      id: 6,
      par: 5,
      teePosition: { x: -1, y: 0, z: -3 },
      holePosition: { x: 1, y: 0, z: 3 },
      surfaces: [
        {
          type: "flat",
          position: { x: -1, y: -0.05, z: -1.5 },
          size: { x: 1.2, y: 0.1, z: 3.5 },
          material: "grass",
          color: "#2E2E2E",
        },
        {
          type: "flat",
          position: { x: 0, y: -0.05, z: 0.5 },
          size: { x: 3, y: 0.1, z: 1.5 },
          material: "grass",
          color: "#2E2E2E",
        },
        {
          type: "flat",
          position: { x: 1, y: -0.05, z: 2.25 },
          size: { x: 1.2, y: 0.1, z: 2 },
          material: "grass",
          color: "#2E2E2E",
        },
      ],
      walls: [
        {
          position: { x: -1.65, y: 0.1, z: -1.5 },
          size: { x: 0.1, y: 0.3, z: 3.5 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: -0.35, y: 0.1, z: -1.75 },
          size: { x: 0.1, y: 0.3, z: 3 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: -1, y: 0.1, z: -3.3 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0, y: 0.1, z: -0.3 },
          size: { x: 3.2, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0, y: 0.1, z: 1.3 },
          size: { x: 3.2, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 0.35, y: 0.1, z: 2.25 },
          size: { x: 0.1, y: 0.3, z: 2 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 1.65, y: 0.1, z: 2.25 },
          size: { x: 0.1, y: 0.3, z: 2 },
          material: "stone",
          color: "#424242",
        },
        {
          position: { x: 1, y: 0.1, z: 3.3 },
          size: { x: 1.4, y: 0.3, z: 0.1 },
          material: "stone",
          color: "#424242",
        },
      ],
      obstacles: [],
      powerUpSpawns: [
        { position: { x: -1, y: 0.1, z: -0.5 } },
        { position: { x: 1, y: 0.1, z: 2 } },
      ],
      waterHazards: [],
      outOfBounds: [],
    },
  ],
};

const courses = new Map<string, Course>();
courses.set(windmillWoods.id, windmillWoods);
courses.set(neonNights.id, neonNights);
courses.set(pirateCove.id, pirateCove);
courses.set(candyLand.id, candyLand);
courses.set(spaceStation.id, spaceStation);
courses.set(hauntedManor.id, hauntedManor);

export function getCourse(id: string): Course | undefined {
  return courses.get(id);
}

export function getAllCourses(): Course[] {
  return Array.from(courses.values());
}
