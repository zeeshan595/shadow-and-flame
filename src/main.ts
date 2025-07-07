import {
  RenderSystem,
  CameraModule,
  MeshModule,
  Geometry,
  Material,
  MaterialType,
  GeometryType,
  LightModule,
  LightType,
  CameraType
} from "@/engine/render";
import { engine, Entity, Vector3, Quaternion } from "@/engine/core";
import { ListenerModule } from '@/engine/audio/listener.module';
import { mount } from 'svelte';
import UI from './ui.svelte';
import './font.css';
import './styles.css';

engine.addSystem(new RenderSystem());

const camera = engine.scene.addEntity(new Entity());
camera.transform.position = new Vector3(0, 2, 4);
camera.transform.rotation = Quaternion.fromEulerAngles(-60, 0, 0);
camera.addModule(new CameraModule());
camera.addModule(new ListenerModule());

const cube = engine.scene.addEntity(new Entity());
cube.transform.position = new Vector3(3.5, -2, 2.5);
const cubeMesh = cube.addModule(new MeshModule());
cubeMesh.setMaterial(new Material(MaterialType.MeshStandardMaterial));
cubeMesh.setGeometry(new Geometry(GeometryType.BoxGeometry));

// const light = engine.scene.addEntity(new Entity());
// light.addModule(new LightModule(LightType.Ambient));

const light2 = engine.scene.addEntity(new Entity());
const light2Light = light2.addModule(new LightModule(LightType.Directional));
light2Light.castShadows = true;
light2Light.directionalLightVector = new Vector3(-1, -2, -1);
light2Light.target = cube;

const floor = engine.scene.addEntity(new Entity());
floor.transform.position = new Vector3(0, -3, 0);
floor.transform.scale = new Vector3(10, 0.1, 6);
const floorMesh = floor.addModule(new MeshModule());
floorMesh.setMaterial(new Material(MaterialType.MeshStandardMaterial));
floorMesh.setGeometry(new Geometry(GeometryType.BoxGeometry));

let rotation = new Vector3();
addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    cube.transform.position.z += 0.1;
  }
  if (e.key === 'ArrowDown') {
    cube.transform.position.z -= 0.1;
  }
  if (e.key === 'ArrowLeft') {
    cube.transform.position.x -= 0.1;
  }
  if (e.key === 'ArrowRight') {
    cube.transform.position.x += 0.1;
  }

  if (e.key === 'w') {
    rotation.x += 1;
  }
  if (e.key === 's') {
    rotation.x -= 1;
  }
  if (e.key === 'a') {
    rotation.y += 1;
  }
  if (e.key === 'd') {
    rotation.y -= 1;
  }
  cube.transform.rotation = Quaternion.fromEulerAngles(
    rotation.x,
    rotation.y,
    rotation.z
  );
});
engine.start();
mount(UI, {
  target: document.getElementById('app')!,
});