import { BoardModule } from "./game/board/board.module";
import { Core, Graphics, Audio } from "@/engine";
import { mount } from 'svelte';
import UI from './ui.svelte';
import './font.css';
import './styles.css';
import { Scene } from "./engine/core/scene";

const renderingSystem = await Core.engine.addSystem(new Graphics.RendererSystem());
// await Core.engine.addSystem(new Physics.PhysicsSystem());

const scene = new Scene();
const camera = scene.addEntity(new Core.Entity("camera"));
camera.transform.position = new Core.Vector3(0, 2, 4);
camera.transform.rotation = Core.Quaternion.fromEulerAngles(-60, 0, 0);
camera.addModule(new Graphics.CameraModule());
camera.addModule(new Audio.ListenerModule());

const light = scene.addEntity(new Core.Entity("light"));
light.addModule(new Graphics.LightModule(Graphics.LightType.Ambient)).intensity = 0.1;

const light2 = scene.addEntity(new Core.Entity());
const light2Light = light2.addModule(new Graphics.LightModule(Graphics.LightType.Directional));
light2Light.castShadows = true;
light2Light.directionalLightVector = new Core.Vector3(-1, -2, -1);
// light2Light.target = cube;

// const board = scene.addEntity(new Core.Entity());
// board.addModule(new BoardModule());

const ground = scene.addEntity(new Core.Entity("ground"));
ground.type = Core.EntityType.Static;
{
  // const collider = ground.addModule(new Physics.ColliderModule());
  // collider.createBox(new Core.Vector3(10, 0.1, 5));
  ground.transform.scale = new Core.Vector3(10, 0.1, 5);
  ground.transform.position = new Core.Vector3(0, -2, 1);
  const groundMesh = ground.addModule(new Graphics.MeshModule());
  groundMesh.setGeometry(new Graphics.Geometry(Graphics.GeometryType.BoxGeometry));
  groundMesh.setMaterial(new Graphics.Material(Graphics.MaterialType.MeshStandardMaterial));
}

const cube = scene.addEntity(new Core.Entity("cube"));
cube.type = Core.EntityType.Dynamic;
{
  cube.transform.position = new Core.Vector3(0, 1, 0);
  const mesh = cube.addModule(new Graphics.MeshModule());
  mesh.setGeometry(new Graphics.Geometry(Graphics.GeometryType.BoxGeometry));
  mesh.setMaterial(new Graphics.Material(Graphics.MaterialType.MeshStandardMaterial));
}

Core.engine.scene = scene;

mount(UI, {
  target: document.getElementById('app')!,
});