import { Core } from "../core";
import * as RAPIER from '@dimforge/rapier3d-compat';
import { Entity } from "../core/entity";

export class RapierSceneManager extends Core.ThirdPartySceneManager<RAPIER.RigidBodyDesc> {
  private _world = new RAPIER.World(new RAPIER.Vector3(0, 0, 0));
  private _bodies = new Map<string, RAPIER.RigidBody>();

  get bodies(): Map<string, RAPIER.RigidBody> {
    return this._bodies;
  }

  constructor() {
    super();
  }

  override set(key: string, value: RAPIER.RigidBodyDesc, parent?: string): void {
    if (!parent) {
      const body = this._world.createRigidBody(value);
      this._bodies.set(key, body);
      return super.set(key, value);
    }
  }
  override delete(key: string): void {
    const body = this._bodies.get(key);
    if (body) {
      this._world.removeRigidBody(body);
      this._bodies.delete(key);
    }
    super.delete(key);
  }
  getBody(key: string): RAPIER.RigidBody | undefined {
    return this._bodies.get(key);
  }
  getAllBodies(): RAPIER.RigidBody[] {
    return [...this._bodies.values()];
  }
  override newObject(entity: InstanceType<typeof Core.Entity>): RAPIER.RigidBodyDesc {
    if (entity.type === Core.EntityType.Dynamic) {
      return new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Dynamic);
    } else {
      return new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Fixed);
    }
  }

  override onPhysics(_: Entity[]): void {
    this._world.step();
  }
}

export function addRapierObjectToScene(uuid: string, body: RAPIER.RigidBodyDesc) {
  const sceneManager = Core.engine.scene.getThirdPartySceneManager(
    Core.SupportedThirdPartySceneManager.RapierJs
  ) as RapierSceneManager;
  sceneManager.set(uuid, body);
}
export function removeRapierObjectFromScene(uuid: string) {
  const sceneManager = Core.engine.scene.getThirdPartySceneManager(
    Core.SupportedThirdPartySceneManager.RapierJs
  ) as RapierSceneManager;
  sceneManager.delete(uuid);
}