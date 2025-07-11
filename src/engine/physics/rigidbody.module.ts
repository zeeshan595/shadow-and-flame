import { Core } from "../core";
import * as RAPIER from '@dimforge/rapier3d-compat';

export class RigidBodyModule extends Core.Module {
  private _description: RAPIER.RigidBodyDesc
  private _body?: RAPIER.RigidBody;

  get body(): RAPIER.RigidBody | undefined {
    return this._body;
  }

  get mass(): number {
    return this._description.mass;
  }
  set mass(value: number) {
    this._description.mass = value;
  }
  get linearVelocity(): InstanceType<typeof Core.Vector3> {
    return new Core.Vector3(
      this._description.linvel.x,
      this._description.linvel.y,
      this._description.linvel.z
    );
  }
  set linearVelocity(value: InstanceType<typeof Core.Vector3>) {
    this._description.linvel = new RAPIER.Vector3(value.x, value.y, value.z);
  }
  get angularVelocity(): InstanceType<typeof Core.Vector3> {
    return new Core.Vector3(
      this._description.angvel.x,
      this._description.angvel.y,
      this._description.angvel.z
    );
  }
  set angularVelocity(value: InstanceType<typeof Core.Vector3>) {
    this._description.angvel = new RAPIER.Vector3(value.x, value.y, value.z);
  }
  get linearDamping(): number {
    return this._description.linearDamping;
  }
  set linearDamping(value: number) {
    this._description.linearDamping = value;
  }
  get angularDamping(): number {
    return this._description.angularDamping;
  }
  set angularDamping(value: number) {
    this._description.angularDamping = value;
  }

  constructor() {
    super('rigidbody');
    let bodyType = RAPIER.RigidBodyType.Dynamic;
    if (this.entity.type === Core.EntityType.Static) {
      bodyType = RAPIER.RigidBodyType.Fixed;
    }
    this._description = new RAPIER.RigidBodyDesc(bodyType);
  }
}