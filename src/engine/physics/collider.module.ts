import * as RAPIER from '@dimforge/rapier3d-compat';
import { Core } from "../core";

export enum ColliderType {
  Ball = 'ball',
  Box = 'box',
  Capsule = 'capsule',
}

export type BallColliderOptions = {
  type: ColliderType.Ball,
  radius: number
};

export type BoxColliderOptions = {
  type: ColliderType.Box,
  halfExtents: InstanceType<typeof Core.Vector3>
};

export type CapsuleColliderOptions = {
  type: ColliderType.Capsule,
  halfHeight: number,
  radius: number
};

export class ColliderModule extends Core.Module {
  private _description: RAPIER.ColliderDesc;
  private _collider?: RAPIER.Collider;

  get frication(): number {
    return this._description.friction;
  }
  set friction(value: number) {
    this._description.friction = value;
  }
  get density(): number {
    return this._description.density;
  }
  set density(value: number) {
    this._description.density = value;
  }
  get mass(): number {
    return this._description.mass;
  }
  set mass(value: number) {
    this._description.mass = value;
  }
  get sensor(): boolean {
    return this._description.isSensor;
  }
  set sensor(value: boolean) {
    this._description.setSensor(value);
  }

  /**
   * creates a collider
   * @param options collider type and properties, defaults to ball collider with 0.5 radius
   */
  constructor(
    options?: BallColliderOptions | BoxColliderOptions | CapsuleColliderOptions
  ) {
    super('collider');
    if (!options) {
      this._description = RAPIER.ColliderDesc.ball(0.5);
      return;
    }
    switch (options.type) {
      case ColliderType.Ball:
        this._description = RAPIER.ColliderDesc.ball(options.radius);
        break;
      case ColliderType.Box:
        this._description = RAPIER.ColliderDesc.cuboid(
          options.halfExtents.x,
          options.halfExtents.y,
          options.halfExtents.z
        );
        break;
      case ColliderType.Capsule:
        this._description = RAPIER.ColliderDesc.capsule(
          options.halfHeight,
          options.radius
        );
        break;
    }
  }
}