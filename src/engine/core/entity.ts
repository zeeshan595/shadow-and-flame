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
  private _children: Entity[] = [];
  private _parent: Entity | null = null;
  private _scene: Scene | null = null;

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
    return module;
  }
  public removeModule(uuid: string): void {
    this._modules[uuid].onDetached();
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
  public addChild(child: Entity): Entity {
    child._parent = this;
    this._scene!.setupEntityUuid(child);
    this._children.push(child);
    for (const sceneManager of this._scene!.thirdPartyScenemanagers()) {
      sceneManager.set(child.uuid, sceneManager.newObject(child), this.uuid);
    }
    return child;
  }
  public removeChild(child: Entity): void {
    const index = this._children.indexOf(child);
    if (index !== -1) {
      child._parent = null;
      this._children.splice(index, 1);
    }
  }
  public getChildren(): Entity[] {
    return this._children;
  }
  public get parent() {
    return this._parent;
  }

  public onStart() {
    for (const child of this._children) {
      child.onStart();
    }
    for (const module of Object.values(this._modules)) {
      module.onStart();
    }
  }

  public onPhysics() {
    for (const child of this._children) {
      child.onPhysics();
    }
    for (const module of Object.values(this._modules)) {
      module.onPhysics();
    }
  }

  public onRender() {
    for (const child of this._children) {
      child.onRender();
    }
    for (const module of Object.values(this._modules)) {
      module.onRender();
    }
  }

  public onStop() {
    for (const child of this._children) {
      child.onStop();
    }
    for (const module of Object.values(this._modules)) {
      module.onStop();
    }
  }
}