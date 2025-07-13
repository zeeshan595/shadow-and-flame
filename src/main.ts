import { BoardModule } from "./game/board/board.module";
import { Core, Graphics, Audio, Physics } from "@/engine";
import './font.css';
import './styles.css';
import { GeometryType } from "./engine/graphics/geometry";
import { JsonParser } from "./engine/core/json.parser";
import { MaterialType } from "./engine/graphics/material";

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
            type: MaterialType.MeshPhongMaterial,
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
    // cube
    {
      name: "cube",
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
console.log(JsonParser.getSchema());
console.log(scene1);
const scene = Core.JsonParser.fromJson(scene1);
if (scene) {
  Core.engine.scene = scene;
} else {
  console.warn('failed to load scene');
}