import * as SystemImport from './physics.system';
import * as RigidBodyImport from './rigidbody.module';
import * as ColliderImport from './collider.module';

export namespace Physics {
  export const PhysicsSystem = SystemImport.PhysicsSystem;
  export const RigidBodyModule = RigidBodyImport.RigidBodyModule;
  export const ColliderModule = ColliderImport.ColliderModule;
  export const ColliderType = ColliderImport.ColliderType;
  export type BallColliderOptions = ColliderImport.BallColliderOptions;
  export type BoxColliderOptions = ColliderImport.BoxColliderOptions;
  export type CapsuleColliderOptions = ColliderImport.CapsuleColliderOptions;
}