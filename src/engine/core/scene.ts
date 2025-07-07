import type { Entity } from "./entity";
import type { Module } from "./module";

export enum SupportedThirdPartySceneManager {
  ThreeJs = 'threejs',
  RapierJs = 'rapierjs'
}

export abstract class ThirdPartySceneManager<T> {
  protected _map: Map<string, T> = new Map();
  public getAll(): T[] {
    return [...this._map.values()];
  }
  public get(key: string): T | undefined {
    return this._map.get(key);
  }
  public set(key: string, value: T, _parent?: string): void {
    this._map.set(key, value);
  }
  public delete(key: string): void {
    this._map.delete(key);
  }
  public newObject(_entity: Entity): T {
    throw new Error('not implemented');
  }

  public onRender(entities: Entity[]): void { }
  public onPhysics(entities: Entity[]): void { }
}

export class Scene {
  private _entities: Entity[] = [];
  private _thirdPartySceneManagers: Map<SupportedThirdPartySceneManager, ThirdPartySceneManager<any>> = new Map();

  public get entities(): Entity[] {
    return this._entities;
  }

  constructor() {
    this._entities = [];
  }

  // events
  public onStart(): void {
    for (const entity of this._entities) {
      entity.onStart();
    }
  }
  public onStop(): void {
    for (const entity of this._entities) {
      entity.onStop();
    }
  }
  public onRender(): void {
    for (const entity of this._entities) {
      entity.onRender();
    }
    for (const sceneManager of this._thirdPartySceneManagers.values()) {
      sceneManager.onRender(this._entities);
    }
  }
  public onPhysics(): void {
    for (const entity of this._entities) {
      entity.onPhysics();
    }
    for (const sceneManager of this._thirdPartySceneManagers.values()) {
      sceneManager.onPhysics(this._entities);
    }
  }

  // entities & modules
  public addEntity(entity: Entity): Entity {
    entity['_scene'] = this;
    this._entities.push(entity);
    for (const sceneManager of this._thirdPartySceneManagers.values()) {
      sceneManager.set(entity.uuid, sceneManager.newObject(entity));
    }
    return entity;
  }
  public removeEntity(entity: Entity): void {
    this._entities = this._entities.filter(e => e.uuid !== entity.uuid);
    for (const thirdPartyScenes of this._thirdPartySceneManagers.values()) {
      for (const mod of Object.values(entity.getModules())) {
        thirdPartyScenes.delete(mod.uuid);
      }
      thirdPartyScenes.delete(entity.uuid);
    }
  }
  public getModulesOfType<T extends Module>(type: string): T[] {
    const modules: T[] = [];
    for (const entity of this._entities) {
      modules.push(entity.getModule(type) as T);
    }
    return modules;
  }

  // third party scene managers
  public getThirdPartySceneManager<T>(key: SupportedThirdPartySceneManager): ThirdPartySceneManager<T> {
    return this._thirdPartySceneManagers.get(key) as ThirdPartySceneManager<T>;
  }
  public addThirdPartySceneManager<T>(key: SupportedThirdPartySceneManager, manager: ThirdPartySceneManager<T>): void {
    if (this._thirdPartySceneManagers.has(key)) return;
    this._thirdPartySceneManagers.set(key, manager);
  }
  public removeThirdPartySceneManager<T>(key: SupportedThirdPartySceneManager): void {
    this._thirdPartySceneManagers.delete(key);
  }
  public thirdPartyScenemanagers(): ThirdPartySceneManager<any>[] {
    return [...this._thirdPartySceneManagers.values()];
  }
}