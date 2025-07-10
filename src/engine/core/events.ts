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
export type EntityEvent = (entity: Entity) => void;
export type ModuleEvent = (module: Module) => void;

export type EventTypeEvent = {
  [EventType.SceneChanged]: SceneChangeEvent;
  [EventType.EntityAdded]: EntityEvent;
  [EventType.EntityRemoved]: EntityEvent;
  [EventType.EntityTransformChanged]: EntityEvent;
  [EventType.ModuleAdded]: ModuleEvent;
  [EventType.ModuleRemoved]: ModuleEvent;
};

export class Events {
  private _onSceneChanged: Set<SceneChangeEvent> = new Set();
  private _onEntityAdded: Set<EntityEvent> = new Set();
  private _onEntityRemoved: Set<EntityEvent> = new Set();
  private _onEntityTransformChanged: Set<EntityEvent> = new Set();
  private _onEntityModuleAdded: Set<ModuleEvent> = new Set();
  private _onEntityModuleRemoved: Set<ModuleEvent> = new Set();

  public addEventListener<T extends EventType>(event: T, callback: EventTypeEvent[T]) {
    switch (event) {
      case EventType.EntityAdded:
        this._onEntityAdded.add(callback as EntityEvent);
        break;
      case EventType.EntityRemoved:
        this._onEntityRemoved.add(callback as EntityEvent);
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
  public removeEventListener<T extends EventType>(event: T, callback: EventTypeEvent[T]) {
    switch (event) {
      case EventType.EntityAdded:
        this._onEntityAdded.delete(callback as EntityEvent);
        break;
      case EventType.EntityRemoved:
        this._onEntityRemoved.delete(callback as EntityEvent);
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
  public triggerEvent<T extends EventType>(event: T, ...args: Parameters<EventTypeEvent[T]>) {
    switch (event) {
      case EventType.EntityAdded:
        this._onEntityAdded.forEach(e => e(...args as Parameters<EntityEvent>));
        break;
      case EventType.EntityRemoved:
        this._onEntityRemoved.forEach(e => e(...args as Parameters<EntityEvent>));
        break;
      case EventType.SceneChanged:
        this._onSceneChanged.forEach(e => e(...args as Parameters<SceneChangeEvent>));
        break;
      case EventType.EntityTransformChanged:
        this._onEntityTransformChanged.forEach(e => e(...args as Parameters<EntityEvent>));
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