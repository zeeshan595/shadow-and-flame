import { Scene } from "./scene";
import type { System } from "./system";

export enum EngineEventType {
  SceneChanged = "sceneChanged",
}

export class Engine {
  private _scene: Scene = new Scene();
  private _systems: System[] = [];
  private _events: Map<EngineEventType, Function[]> = new Map();
  private _hasUserInteractedWithWindow = false;

  constructor() {
    document.addEventListener('click', () => this.handleActivatedWindow);
  }

  private handleActivatedWindow() {
    this._hasUserInteractedWithWindow = true;
    document.removeEventListener('click', () => this.handleActivatedWindow);
  }
  onPhysics() {
    this._scene.onPhysics();
    for (const system of this.systems) {
      system.onPhysics();
    }
  }
  onRender() {
    this._scene.onRender();
    for (const system of this.systems) {
      system.onRender();
    }
  }
  addEventListener(event: EngineEventType, callback: Function) {
    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    this._events.get(event)?.push(callback);
  }
  removeEventListener(event: EngineEventType, callback: Function) {
    if (!this._events.has(event)) {
      return;
    }
    const events = this._events.get(event)!;
    this._events.set(event, events.filter(e => e !== callback));
  }
  get hasUserInteractedWithWindow(): boolean {
    return this._hasUserInteractedWithWindow;
  }
  get scene(): Scene {
    return this._scene;
  }
  set scene(value: Scene) {
    this._scene.onStop();
    this._scene = value;
    this._scene.onStart();
    for (const event of this._events.get(EngineEventType.SceneChanged) ?? []) {
      event();
    }
  }
  get systems(): System[] {
    return this._systems;
  }
  addSystem(system: System): System {
    this._systems.push(system);
    return system;
  }
  start() {
    this.scene.onStart();
  }
}
const _engine = new Engine();
export const engine = _engine;