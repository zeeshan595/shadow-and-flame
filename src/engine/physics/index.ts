import * as SystemImport from './physics.system';
import * as RigidBodyImport from './rigidbody.module';
import * as ColliderImport from './collider.module';

export namespace Physics {
  export const PhysicsSystem = SystemImport.PhysicsSystem;
  export const RigidBodyModule = RigidBodyImport.RigidBodyModule;
  export const ColliderModule = ColliderImport.ColliderModule;
}