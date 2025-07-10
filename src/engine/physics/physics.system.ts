import { Core } from "@/engine/core";
import * as RAPIER from '@dimforge/rapier3d-compat';
import { engine } from "../core/engine";

export class PhysicsSystem extends Core.System {
  private _timeout = 0;
  private _world = new RAPIER.World(new RAPIER.Vector3(0, -9.8, 0));
  

  override async onAttached(): Promise<void> {
    Core.engine.events.addEventListener(
      Core.EventType.SceneChanged,
      () => this.onSceneChanged()
    )
    Core.engine.events.addEventListener(
      Core.EventType.EntityAdded,
      (
        entity: InstanceType<typeof Core.Entity>,
        parent?: InstanceType<typeof Core.Entity>
      ) => this.onEntityAdded(entity, parent)
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
    this._timeout = setTimeout(engine.onPhysics, 16);
  }
  override async onDetached(): Promise<void> {
    Core.engine.events.removeEventListener(
      Core.EventType.SceneChanged,
      () => this.onSceneChanged()
    )
    Core.engine.events.removeEventListener(
      Core.EventType.EntityAdded,
      (
        entity: InstanceType<typeof Core.Entity>,
        parent?: InstanceType<typeof Core.Entity>
      ) => this.onEntityAdded(entity, parent)
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
      clearTimeout(this._timeout);
      this._timeout = 0;
    }
  }

  private onSceneChanged() {
    this._world = new RAPIER.World(new RAPIER.Vector3(0, -9.8, 0));
  }
  private onEntityAdded(entity: InstanceType<typeof Core.Entity>, parent?: InstanceType<typeof Core.Entity>) {

  }
  private onEntityRemoved(entity: InstanceType<typeof Core.Entity>) {
  }
  private onEntityTransformChanged(entity: InstanceType<typeof Core.Entity>) {
  }
  private onModuleAdded(module: InstanceType<typeof Core.Module>) { }
  private onModuleRemoved(module: InstanceType<typeof Core.Module>) { }

  override onPhysics(): void {

  }
}
