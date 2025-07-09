import { Vector3 } from "./vector";
import { Quaternion } from './quaternion';
import type { Entity } from "./entity";
import { engine } from "./engine";
import { EventType } from "./events";

export class Transform {
  private _position: Vector3 = new Vector3();
  private _rotation: Quaternion = new Quaternion();
  private _scale: Vector3 = new Vector3(1, 1, 1);
  private _entity: Entity;

  get position(): Vector3 {
    return this._position;
  }
  set position(value: Vector3) {
    this._position = value;
    engine.events.triggerEvent(
      EventType.EntityTransformChanged,
      this._entity,
    );
  }
  get rotation(): Quaternion {
    return this._rotation;
  }
  set rotation(value: Quaternion) {
    this._rotation = value;
    engine.events.triggerEvent(
      EventType.EntityTransformChanged,
      this._entity,
    );
  }
  get scale(): Vector3 {
    return this._scale;
  }
  set scale(value: Vector3) {
    this._scale = value;
    engine.events.triggerEvent(
      EventType.EntityTransformChanged,
      this._entity,
    );
  }

  constructor(entity: Entity) {
    this._entity = entity;
  }

  get globalPosition(): Vector3 {
    if (this._entity.parent) {
      return this.position.add(this._entity.parent.transform.globalPosition);
    }
    return this.position;
  }

  get globalRotation(): Quaternion {
    if (this._entity.parent) {
      return this.rotation.multiply(this._entity.parent.transform.globalRotation);
    }
    return this.rotation;
  }
}