import { Core } from "@/engine/core";
import { engine } from "../core/engine";
import * as RAPIER from '@dimforge/rapier3d-compat';
import { RigidBodyModule } from "./rigidbody.module";
import { ColliderModule } from "./collider.module";
import { Entity } from "../core/entity";

export class PhysicsSystem extends Core.System {
  private _timeout = 0;
  private _world: RAPIER.World = null as any;
  private _entityMap = new Map<string, InstanceType<typeof Core.Entity>>();
  private _rigidBodyMap = new Map<string, InstanceType<typeof RAPIER.RigidBody>>();
  private _colliderMap = new Map<string, InstanceType<typeof RAPIER.Collider>>();

  override async onAttached(): Promise<void> {
    await RAPIER.init();
    this._world = new RAPIER.World(new RAPIER.Vector3(0, -9.8, 0));
    Core.engine.events.addEventListener(
      Core.EventType.EntityAdded,
      (entity: InstanceType<typeof Core.Entity>) => this.onEntityAdded(entity)
    );
    Core.engine.events.addEventListener(
      Core.EventType.EntityRemoved,
      (entity: InstanceType<typeof Core.Entity>) => this.onEntityRemoved(entity)
    );
    Core.engine.events.addEventListener(
      Core.EventType.EntityTransformChanged,
      (entity: InstanceType<typeof Core.Entity>) => this.onEntityTransformChanged(entity)
    );
    Core.engine.events.addEventListener(
      Core.EventType.ModuleAdded,
      (module: InstanceType<typeof Core.Module>) => this.onModuleAdded(module)
    );
    Core.engine.events.addEventListener(
      Core.EventType.ModuleRemoved,
      (module: InstanceType<typeof Core.Module>) => this.onModuleRemoved(module)
    );
    this._timeout = setInterval(() => engine.onPhysics(), 16);
  }
  override async onDetached(): Promise<void> {
    Core.engine.events.removeEventListener(
      Core.EventType.EntityAdded,
      (entity: InstanceType<typeof Core.Entity>) => this.onEntityAdded(entity)
    );
    Core.engine.events.removeEventListener(
      Core.EventType.EntityRemoved,
      (entity: InstanceType<typeof Core.Entity>) => this.onEntityRemoved(entity)
    );
    Core.engine.events.removeEventListener(
      Core.EventType.EntityTransformChanged,
      (entity: InstanceType<typeof Core.Entity>) => this.onEntityTransformChanged(entity)
    );
    Core.engine.events.removeEventListener(
      Core.EventType.ModuleAdded,
      (module: InstanceType<typeof Core.Module>) => this.onModuleAdded(module)
    );
    Core.engine.events.removeEventListener(
      Core.EventType.ModuleRemoved,
      (module: InstanceType<typeof Core.Module>) => this.onModuleRemoved(module)
    );
    if (this._timeout > 0) {
      clearInterval(this._timeout);
      this._timeout = 0;
    }
  }
  private findModuleOnParent<T extends InstanceType<typeof Core.Module>>(
    module: string,
    entity: InstanceType<typeof Core.Entity>
  ): T | null {
    const m = entity.getModule(module);
    if (m) return m as T;
    if (!entity.parent) return null;
    return this.findModuleOnParent(module, entity.parent);
  }
  private onEntityAdded(entity: InstanceType<typeof Core.Entity>) {
    this._entityMap.set(entity.uuid, entity);
  }
  private onEntityRemoved(entity: InstanceType<typeof Core.Entity>) {
    console.log('test');
    this._entityMap.delete(entity.uuid);
  }
  private onEntityTransformChanged(entity: InstanceType<typeof Core.Entity>) {

  }
  private onModuleAdded(module: InstanceType<typeof Core.Module>) {
    if (module.getModuleType() === 'rigidbody') {
      const bodyModule = module as RigidBodyModule;
      const body = this._world.createRigidBody(bodyModule['_description']);
      this._rigidBodyMap.set(module.entity.uuid, body);
      this.updateRapierPosition(body, module.entity);
    } else if (module.getModuleType() === 'collider') {
      const colliderModule = module as ColliderModule;
      const parent = this.findModuleOnParent<RigidBodyModule>('rigidbody', module.entity);
      let parentBody = parent ? this._rigidBodyMap.get(parent.entity.uuid) : undefined;
      const collider = this._world.createCollider(
        colliderModule['_description'],
        parentBody
      );
      colliderModule['_collider'] = collider;
      this._colliderMap.set(module.entity.uuid, collider);
      this.updateRapierPosition(collider, module.entity);
    }
  }
  private onModuleRemoved(module: InstanceType<typeof Core.Module>) {
    if (module.getModuleType() === 'rigidbody') {
      const body = this._rigidBodyMap.get(module.entity.uuid);
      if (!body) return;
      this._world.removeRigidBody(body);
      this._rigidBodyMap.delete(module.entity.uuid);
    } else if (module.getModuleType() === 'collider') {
      const collider = this._colliderMap.get(module.entity.uuid);
      if (!collider) return;
      this._world.removeCollider(collider, false);
      this._colliderMap.delete(module.entity.uuid);
    }
  }
  override onPhysics(): void {
    this._world.step();
    for (const key of this._rigidBodyMap.keys()) {
      const body = this._rigidBodyMap.get(key);
      if (!body) continue;
      const entity = this._entityMap.get(key);
      if (!entity) continue;

      const position = body.translation();
      const rotation = body.rotation();
      entity.transform.position = new Core.Vector3(
        position.x,
        position.y,
        position.z
      );
      entity.transform.rotation = new Core.Quaternion(
        rotation.x,
        rotation.y,
        rotation.z,
        rotation.w
      );
    }
  }
  private updateRapierPosition(
    obj: RAPIER.RigidBody | RAPIER.Collider,
    entity: Entity
  ) {
    obj.setTranslation(
      new RAPIER.Vector3(
        entity.transform.position.x,
        entity.transform.position.y,
        entity.transform.position.z
      ),
      true,
    );
    obj.setRotation(
      new RAPIER.Quaternion(
        entity.transform.rotation.x,
        entity.transform.rotation.y,
        entity.transform.rotation.z,
        entity.transform.rotation.w
      ),
      true
    )
  }
}
