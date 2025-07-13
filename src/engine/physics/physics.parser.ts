import { Core } from "../core";
import { ColliderModule, ColliderType } from "./collider.module";
import { RigidBodyModule } from "./rigidbody.module";

export class PhysicsJsonParser {
  addEvents() {
    Core.JsonParser.addModuleParser('rigidbody', {
      fromJson: (m) => this.rigidbodyFromJson(m),
      toJson: (m) => this.rigidBodyToJson(m),
      jsonSchema: {
        type: "object",
        properties: {
          type: { const: "rigidbody" },
          mass: { type: "number" },
        }
      }
    });
    Core.JsonParser.addModuleParser('collider', {
      fromJson: (m) => this.colliderFromJson(m),
      toJson: (m) => this.colliderToJson(m),
      jsonSchema: {
        type: "object",
        properties: {
          type: { const: "collider" },
          colliderType: {
            type: "string",
            enum: Object.values(ColliderType)
          },
          radius: { type: "number" },
          halfHeight: { type: "number" },
          halfExtents: Core.JsonParser.getObjectSchemaRef('vector3'),
        }
      }
    });
  }
  removeEvents() {
    Core.JsonParser.removeModuleParser('rigidbody');
    Core.JsonParser.removeModuleParser('collider');
  }

  private rigidbodyFromJson(module: any): InstanceType<typeof Core.Module> {
    const body = new RigidBodyModule();
    body.mass = module.mass ?? 1;
    //todo: support more 
    return body;
  }

  private rigidBodyToJson(module: InstanceType<typeof Core.Module>): any {
    const body = module as RigidBodyModule;
    return {
      type: "rigidbody",
      mass: body.mass
    };
  }

  private colliderFromJson(module: any): InstanceType<typeof Core.Module> {
    let collider: ColliderModule;
    switch (module.colliderType) {
      default:
      case ColliderType.Ball:
        collider = new ColliderModule({
          type: ColliderType.Ball,
          radius: module.radius ?? 0.5
        })
        break;
      case ColliderType.Box:
        collider = new ColliderModule({
          type: ColliderType.Box,
          halfExtents: new Core.Vector3(
            module.halfExtents?.x ?? 0.5,
            module.halfExtents?.y ?? 0.5,
            module.halfExtents?.z ?? 0.5
          )
        })
        break;
      case ColliderType.Capsule:
        collider = new ColliderModule({
          type: ColliderType.Capsule,
          radius: module.radius ?? 0.5,
          halfHeight: module.halfHeight ?? 1
        })
        break;
    }
    return collider;
  }

  private colliderToJson(_: InstanceType<typeof Core.Module>): any {
    return {
      type: "collider",
    };
  }
}