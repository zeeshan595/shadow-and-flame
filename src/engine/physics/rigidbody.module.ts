import { Core } from "../core";
import * as RAPIER from '@dimforge/rapier3d-compat';

export class RigidBodyModule extends Core.Module {
  private _bodyDescription: RAPIER.RigidBodyDesc
  private _body?: RAPIER.RigidBody;

  get body(): RAPIER.RigidBody | undefined {
    return this._body;
  }

  get mass(): number {
    return this._bodyDescription.mass;
  }
  set mass(value: number) {
    this._bodyDescription.mass = value;
  }
  get linearVelocity(): InstanceType<typeof Core.Vector3> {
    return new Core.Vector3(
      this._bodyDescription.linvel.x,
      this._bodyDescription.linvel.y,
      this._bodyDescription.linvel.z
    );
  }
  set linearVelocity(value: InstanceType<typeof Core.Vector3>) {
    this._bodyDescription.linvel = new RAPIER.Vector3(value.x, value.y, value.z);
  }
  get angularVelocity(): InstanceType<typeof Core.Vector3> {
    return new Core.Vector3(
      this._bodyDescription.angvel.x,
      this._bodyDescription.angvel.y,
      this._bodyDescription.angvel.z
    );
  }
  set angularVelocity(value: InstanceType<typeof Core.Vector3>) {
    this._bodyDescription.angvel = new RAPIER.Vector3(value.x, value.y, value.z);
  }
  get linearDamping(): number {
    return this._bodyDescription.linearDamping;
  }
  set linearDamping(value: number) {
    this._bodyDescription.linearDamping = value;
  }
  get angularDamping(): number {
    return this._bodyDescription.angularDamping;
  }
  set angularDamping(value: number) {
    this._bodyDescription.angularDamping = value;
  }

  constructor() {
    super('rigidbody');
    let bodyType = RAPIER.RigidBodyType.Dynamic;
    if (this.entity.type === Core.EntityType.Static) {
      bodyType = RAPIER.RigidBodyType.Fixed;
    }
    this._bodyDescription = new RAPIER.RigidBodyDesc(bodyType);
  }

  override onStart(): void {
    const rapierSceneManager = Core.engine.scene.getThirdPartySceneManager(
      Core.SupportedThirdPartySceneManager.RapierJs
    ) as RapierSceneManager;
    this._body = rapierSceneManager.set(this.uuid, this._bodyDescription);
    if (this.entity.parent) {
      console.warn('Rpiaer does not support parents on rigidbodies');
    }
  }

  override onStop(): void {
    const rapierSceneManager = Core.engine.scene.getThirdPartySceneManager(
      Core.SupportedThirdPartySceneManager.RapierJs
    ) as RapierSceneManager;
    rapierSceneManager.delete(this.uuid);
  }

  override onPhysics(): void {
    if (!this._body) return;
    const translation = this._body.translation();
    this.entity.transform.position = new Core.Vector3(
      translation.x,
      translation.y,
      translation.z
    );
    const rotation = this._body.rotation();
    this.entity.transform.rotation = new Core.Quaternion(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w
    );
  }
}