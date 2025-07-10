import type { System } from "./system";
import { Events, EventType } from "./events";
import { Scene } from "./scene";
import { Entity } from "./entity";

export enum EngineEventType {
  SceneChanged = "sceneChanged",
}

export class Engine {
  private _scene: Scene = new Scene();
  private _systems: Set<System> = new Set();
  private _systemInitPromise: Map<System, Promise<void>> = new Map();
  private _events: Events = new Events();
  private _hasUserInteractedWithWindow = false;

  public get events(): Events {
    return this._events;
  }

  constructor() {
    document.addEventListener('click', () => this.handleActivatedWindow);
    this.scene.onStart();
  }

  // handle window activation
  private handleActivatedWindow() {
    this._hasUserInteractedWithWindow = true;
    document.removeEventListener('click', () => this.handleActivatedWindow);
  }
  get hasUserInteractedWithWindow(): boolean {
    return this._hasUserInteractedWithWindow;
  }

  // scene
  get scene(): Scene {
    return this._scene;
  }
  set scene(value: Scene) {

    // change scene
    const prev = this._scene;
    this._scene = value;
    for (const entity of prev.entities) {
      prev.removeEntity(entity);
    }
    prev.onStop();
    value.onStart();
    for (const entity of value.entities) {
      this.recursivelyTriggerAddEvents(entity);
    }

    // send scene change event
    this._events.triggerEvent(EventType.SceneChanged, prev, value);
  }
  private recursivelyTriggerAddEvents(entity: Entity) {
    this._events.triggerEvent(EventType.EntityAdded, entity);
    this._events.triggerEvent(EventType.EntityTransformChanged, entity);
    for (const module of Object.values(entity.getModules())) {
      this._events.triggerEvent(EventType.ModuleAdded, module);
    }
    for (const child of entity.getChildren()) {
      this.recursivelyTriggerAddEvents(child);
    }
  }

  // system
  addSystem<T extends System>(system: T): T {
    this._systems.add(system);
    this._systemInitPromise.set(system, system.onAttached());
    return system;
  }
  async removeSystem(system: System): Promise<void> {
    const sys = this._systemInitPromise.get(system);
    if (!sys) {
      console.warn('system is not initialized');
      return;
    }
    await Promise.all([sys, system.onDetached()]);
    this._systems.delete(system);
    this._systemInitPromise.delete(system);
  }
  async waitForSystem(system: System): Promise<void> {
    return this._systemInitPromise.get(system);
  }

  // loop evenets
  public onPhysics() {
    this.scene.onPhysics();
    for (const system of this._systems) {
      system.onPhysics();
    }
  }
  public onRender() {
    this.scene.onRender();
    for (const system of this._systems) {
      system.onRender();
    }
  }
}
const _engine = new Engine();
export const engine = _engine;