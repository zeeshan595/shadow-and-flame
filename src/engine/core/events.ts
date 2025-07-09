import { Entity } from "./entity";
import { Module } from "./module";
import { Scene } from "./scene";

export enum EventType {
  SceneChanged = "sceneChanged",
  EntityAdded = "entityAdded",
  EntityRemoved = "entityRemoved",
  EntityTransformChanged = "entityTransformChanged",
  ModuleAdded = "moduleAdded",
  ModuleRemoved = "moduleRemoved",
}

export type SceneChangeEvent = (previousScene: Scene, nextScene: Scene) => void;
export type SceneEvent = (entity: Entity) => void;
export type EntityEvent = (entity: Entity) => void;
export type ModuleEvent = (module: Module) => void;

export type ALL_EVENTS = |
  SceneEvent |
  SceneChangeEvent |
  EntityEvent |
  ModuleEvent;


export class Events {
  private _onEntityAdded: Set<SceneEvent> = new Set();
  private _onEntityRemoved: Set<SceneEvent> = new Set();
  private _onSceneChanged: Set<SceneChangeEvent> = new Set();
  private _onEntityTransformChanged: Set<SceneEvent> = new Set();
  private _onEntityModuleAdded: Set<ModuleEvent> = new Set();
  private _onEntityModuleRemoved: Set<ModuleEvent> = new Set();

  public addEventListener<T extends ALL_EVENTS>(event: EventType, callback: T) {
    switch (event) {
      case EventType.EntityAdded:
        this._onEntityAdded.add(callback as SceneEvent);
        break;
      case EventType.EntityRemoved:
        this._onEntityRemoved.add(callback as SceneEvent);
        break;
      case EventType.SceneChanged:
        this._onSceneChanged.add(callback as SceneChangeEvent);
        break;
      case EventType.EntityTransformChanged:
        this._onEntityTransformChanged.add(callback as EntityEvent);
        break;
      case EventType.ModuleAdded:
        this._onEntityModuleAdded.add(callback as ModuleEvent);
        break;
      case EventType.ModuleRemoved:
        this._onEntityModuleRemoved.add(callback as ModuleEvent);
        break;
    }
  }
  public removeEventListener<T extends ALL_EVENTS>(event: EventType, callback: T) {
    switch (event) {
      case EventType.EntityAdded:
        this._onEntityAdded.delete(callback as SceneEvent);
        break;
      case EventType.EntityRemoved:
        this._onEntityRemoved.delete(callback as SceneEvent);
        break;
      case EventType.SceneChanged:
        this._onSceneChanged.delete(callback as SceneChangeEvent);
        break;
      case EventType.EntityTransformChanged:
        this._onEntityTransformChanged.delete(callback as EntityEvent);
        break;
      case EventType.ModuleAdded:
        this._onEntityModuleAdded.delete(callback as ModuleEvent);
        break;
      case EventType.ModuleRemoved:
        this._onEntityModuleRemoved.delete(callback as ModuleEvent);
        break;
    }
  }
  public triggerEvent(event: EventType, ...args: Parameters<ALL_EVENTS>) {
    switch (event) {
      case EventType.EntityAdded:
        this._onEntityAdded.forEach(e => e(...args as Parameters<SceneEvent>));
        break;
      case EventType.EntityRemoved:
        this._onEntityRemoved.forEach(e => e(...args as Parameters<SceneEvent>));
        break;
      case EventType.SceneChanged:
        this._onSceneChanged.forEach(e => e(...args as Parameters<SceneChangeEvent>));
        break;
      case EventType.EntityTransformChanged:
        this._onEntityTransformChanged.forEach(e => e(...args as Parameters<SceneEvent>));
        break;
      case EventType.ModuleAdded:
        this._onEntityModuleAdded.forEach(e => e(...args as Parameters<ModuleEvent>));
        break;
      case EventType.ModuleRemoved:
        this._onEntityModuleRemoved.forEach(e => e(...args as Parameters<ModuleEvent>));
        break;
    }
  }
}