import { engine } from "./engine";
import { EventType } from "./events";
import type { Module } from "./module";
import { Scene } from "./scene";
import { Transform } from "./transform";

export enum EntityType {
  Dynamic = 'dynamic',
  Static = 'static',
}

export class Entity {
  public readonly uuid: string = crypto.randomUUID();
  public name: string = '';
  public transform: Transform = new Transform(this);
  public type: EntityType = EntityType.Dynamic;

  private _modules: Record<string, Module> = {};
  private _children: Set<Entity> = new Set();
  private _parent: Entity | null = null;
  private _scene: Scene = new Scene();

  constructor(name?: string) {
    if (name) {
      this.name = name;
    } else {
      this.name = `new Entity`;
    }
  }

  public addModule<T extends Module>(module: T): T {
    module['_entity'] = this;
    this._modules[module.uuid] = module;
    this._modules[module.uuid].onAttached();
    if (Scene.current === this._scene)
      engine.events.triggerEvent(EventType.ModuleAdded, this._modules[module.uuid]);
    return module;
  }
  public removeModule(uuid: string): void {
    this._modules[uuid].onDetached();
    if (Scene.current === this._scene)
      engine.events.triggerEvent(EventType.ModuleRemoved, this._modules[uuid]);
    delete this._modules[uuid];
  }
  public getModuleByUUID<T extends Module>(uuid: string): T | undefined {
    return this._modules[uuid] as T;
  }
  public getModule(type: string) {
    for (const value of Object.values(this._modules)) {
      if (value.getModuleType() === type) {
        return value;
      }
    }
    return undefined;
  }
  public getModules(): Record<string, Module> {
    return this._modules;
  }
  public getChildren(): Set<Entity> {
    return this._children;
  }
  public get parent() {
    return this._parent;
  }
}