import type { Entity } from "./entity";
import type { Module } from "./module";
import { engine } from "./engine";
import { EventType } from "./events";

export class Scene {
  private _entitiesByUuid: Map<string, Entity> = new Map();
  private _entities: Set<Entity> = new Set();

  public static get current(): Scene {
    return engine.scene;
  }
  public get entities(): Set<Entity> {
    return this._entities;
  }

  public addEntity(entity: Entity, parent?: Entity): Entity {
    this._entities.add(entity);
    this._entitiesByUuid.set(entity.uuid, entity);
    entity['_scene'] = this;
    if (parent) {
      parent['_children'].add(entity);
      entity['_parent'] = parent;
    }
    if (Scene.current === this)
      engine.events.triggerEvent(EventType.EntityAdded, entity);
    return entity;
  }
  public removeEntity(entity: Entity): void {
    for (const module of Object.keys(entity.getModules())) {
      entity.removeModule(module);
    }
    for (const child of entity.getChildren()) {
      this.removeEntity(child);
    }
    if (entity.parent) {
      entity.parent['_children'].delete(entity);
    }
    this._entities.delete(entity);
    this._entitiesByUuid.delete(entity.uuid);
    if (Scene.current === this)
      engine.events.triggerEvent(EventType.EntityRemoved, entity);
  }
  public getModulesOfType<T extends Module>(type: string): T[] {
    const modules: T[] = [];
    for (const entity of this._entities) {
      modules.push(entity.getModule(type) as T);
    }
    return modules;
  }

  // loop events
  public onStart(): void {
    for (const entity of this._entities) {
      for (const module of Object.values(entity.getModules())) {
        module.onStart();
      }
    }
  }
  public onStop(): void {
    for (const entity of this._entities) {
      for (const module of Object.values(entity.getModules())) {
        module.onStop();
      }
    }
  }
  public onRender(): void {
    for (const entity of this._entities) {
      for (const module of Object.values(entity.getModules())) {
        module.onRender();
      }
    }
  }
  public onPhysics(): void {
    for (const entity of this._entities) {
      for (const module of Object.values(entity.getModules())) {
        module.onPhysics();
      }
    }
  }
}