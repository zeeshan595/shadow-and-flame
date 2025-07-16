import { Core, Graphics, Audio, Physics } from "@/engine";
import './styles.css';
import './font.css';

await Core.engine.addSystem(new Graphics.RendererSystem());
await Core.engine.addSystem(new Physics.PhysicsSystem());

const tiles = [];
for (let y = -3; y <= 3; y++) {
  for (let x = -5; x <= 5; x++) {
    tiles.push({
      name: `tile-${(x + 5)}x${(y + 3)}`,
      transform: {
        position: {
          x: x + (x * 0.1),
          y: 0,
          z: y + (y * 0.1)
        },
        rotation: {
          $eulerAngles: {
            x: -90,
            y: 0,
            z: 0
          }
        }
      },
      modules: [
        {
          type: "mesh",
          geometry: { type: "PlaneGeometry" },
          material: {
            type: "MeshPhongMaterial",
            enableAlphaBlending: true,
            opacity: 0.3,
          },
        },
        { type: "collider", colliderType: "box", halfExtents: { x: 0.5, y: 0.05, z: 0.5 } },
      ]
    });
  }
}

const scene1 = {
  "$schema": "./schema.json",
  version: "0.0.1",
  entities: [
    // camera
    {
      name: "camera",
      transform: {
        position: {
          x: 0,
          y: 6,
          z: 5
        },
        rotation: {
          $eulerAngles: {
            x: -60,
            y: 0,
            z: 0
          }
        }
      },
      modules: [{ type: "camera" }]
    },
    // light
    {
      name: "ambientLight",
      modules: [
        {
          type: "light",
          lightType: "ambient",
          intensity: 0.1
        }
      ]
    },
    {
      name: "directionalLight",
      modules: [
        {
          type: "light",
          lightType: "directional",
          directionalVector: {
            x: -1,
            y: -2,
            z: -1
          }
        }
      ]
    },
    // board
    {
      name: "board",
      children: tiles
    },
    // character
    {
      name: "character",
      tags: ["player"],
      transform: {
        position: { x: 3, y: 1, z: 0 }
      },
      modules: [
        { type: "mesh", geometry: { type: "BoxGeometry" }, material: { type: "MeshPhongMaterial" } },
        { type: "rigidbody" },
        { type: "collider", colliderType: "box", halfExtents: { x: 0.5, y: 0.5, z: 0.5 } },
      ]
    }
  ],
};
const scene = Core.JsonParser.fromJson(scene1);
if (!scene) {
  throw new Error('failed to lad scene');
}
const player = scene.getEntitiesByTag('player')[0];
if (!player) {
  throw new Error('failed to find player');
}

if (scene) {
  Core.engine.scene = scene;
} else {
  console.warn('failed to load scene');
}