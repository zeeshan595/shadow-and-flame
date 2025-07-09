import { Core } from "../core";
import * as RAPIER from '@dimforge/rapier3d-compat';
import { RapierSceneManager } from "./scene.manager";
import { RigidBodyModule } from "./rigidbody.module";

export class ColliderModule extends Core.Module {
  private _colliderDescription: RAPIER.ColliderDesc;
  private _collider?: RAPIER.Collider;
  private _parent?: RAPIER.RigidBody;

  constructor() {
    super('collider');
    this._colliderDescription = RAPIER.ColliderDesc.ball(1);
  }

  private getParent(): RAPIER.RigidBody | undefined {
    if (!this.entity.parent) return undefined;
    const rigidbody = this.entity.parent.getModule("rigidbody");
    if (!rigidbody) return undefined;
    const body = (rigidbody as RigidBodyModule).body;
    return body;
  }

  override onStart(): void {
    this._parent = this.getParent();
    const rapierSceneManager = Core.engine.scene.getThirdPartySceneManager(
      Core.SupportedThirdPartySceneManager.RapierJs
    ) as RapierSceneManager;
    this._collider = rapierSceneManager.world.createCollider(
      this._colliderDescription,
      this._parent
    );
  }

  override onStop(): void {
    if (!this._collider) return;
    const rapierSceneManager = Core.engine.scene.getThirdPartySceneManager(
      Core.SupportedThirdPartySceneManager.RapierJs
    ) as RapierSceneManager;
    rapierSceneManager.world.removeCollider(this._collider, false);
  }

  createBall(radius: number) {
    this._colliderDescription.shape = new RAPIER.Ball(radius);
  }
  createBox(halfExtents: InstanceType<typeof Core.Vector3>) {
    this._colliderDescription.shape = new RAPIER.Cuboid(
      halfExtents.x,
      halfExtents.y,
      halfExtents.z
    );
  }
  createCapsule(halfHeight: number, radius: number) {
    this._colliderDescription.shape = new RAPIER.Capsule(halfHeight, radius);
  }

  override onPhysics(): void {
    if (!this._collider) return;
    if (this._parent) {
      this._collider.setTranslationWrtParent(
        new RAPIER.Vector3(
          this.entity.transform.position.x,
          this.entity.transform.position.y,
          this.entity.transform.position.z
        )
      );
      this._collider.setTranslationWrtParent(
        new RAPIER.Quaternion(
          this.entity.transform.rotation.x,
          this.entity.transform.rotation.y,
          this.entity.transform.rotation.z,
          this.entity.transform.rotation.w
        )
      );
    } else {
      this._collider.setTranslation(
        new RAPIER.Vector3(
          this.entity.transform.position.x,
          this.entity.transform.position.y,
          this.entity.transform.position.z
        )
      );
      this._collider.setRotation(
        new RAPIER.Quaternion(
          this.entity.transform.rotation.x,
          this.entity.transform.rotation.y,
          this.entity.transform.rotation.z,
          this.entity.transform.rotation.w
        )
      );
    }
  }
}