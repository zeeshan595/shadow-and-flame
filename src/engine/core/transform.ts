import { Vector3 } from "./vector";
import { Quaternion } from './quaternion';
import type { Entity } from "./index"; 0
import * as THREE from 'three';

export class Transform {
  public position: Vector3 = new Vector3();
  public rotation: Quaternion = new Quaternion();
  public scale: Vector3 = new Vector3(1, 1, 1);
  private _entity: Entity;

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