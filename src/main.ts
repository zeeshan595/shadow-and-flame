import { BoardModule } from "./game/board/board.module";
import { Core, Graphics, Audio, Physics } from "@/engine";
import { mount } from 'svelte';
import UI from './ui.svelte';
import './font.css';
import './styles.css';

await Core.engine.addSystem(new Graphics.RendererSystem());
await Core.engine.addSystem(new Physics.PhysicsSystem());

// const schema = Core.SceneJsonParser.getSchema();
// const schemaStr = JSON.stringify(schema, null, 2);
// console.log(schemaStr);

const req = await fetch('/scene.json');
const data = await req.json();
const scene = Core.SceneJsonParser.fromJson(data);
if (scene) {
  Core.engine.scene = scene;
} else {
  console.warn('failed to load scene');
}
mount(UI, {
  target: document.getElementById('app')!,
});