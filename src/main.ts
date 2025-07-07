import { BoardModule } from "./game/board/board.module";
import { Core, Graphics, Audio } from "@/engine";
import { mount } from 'svelte';
import UI from './ui.svelte';
import './font.css';
import './styles.css';

Core.engine.addSystem(new Graphics.RendererSystem());

const camera = Core.engine.scene.addEntity(new Core.Entity());
camera.transform.position = new Core.Vector3(0, 2, 4);
camera.transform.rotation = Core.Quaternion.fromEulerAngles(-60, 0, 0);
camera.addModule(new Graphics.CameraModule());
camera.addModule(new Audio.ListenerModule());

const light = Core.engine.scene.addEntity(new Core.Entity());
light.addModule(new Graphics.LightModule(Graphics.LightType.Ambient)).intensity = 0.1;

const light2 = Core.engine.scene.addEntity(new Core.Entity());
const light2Light = light2.addModule(new Graphics.LightModule(Graphics.LightType.Directional));
light2Light.castShadows = true;
light2Light.directionalLightVector = new Core.Vector3(-1, -2, -1);
// light2Light.target = cube;

const board = Core.engine.scene.addEntity(new Core.Entity());
board.addModule(new BoardModule());

Core.engine.start();
mount(UI, {
  target: document.getElementById('app')!,
});