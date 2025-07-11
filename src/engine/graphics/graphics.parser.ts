import { Core } from '@/engine';
import { CameraModule } from './camera.module';
import { LightModule, LightType } from './light.module';
import { MeshModule } from './mesh.module';
import { Material, MaterialType } from './material';
import { Geometry, GeometryType } from './geometry';

export class GraphicsLoader {
  addEvents() {
    Core.SceneJsonParser.addModuleParser('camera', {
      fromJson: (m) => this.cameraFromJson(m),
      toJson: (m) => this.cameraToJson(m),
      jsonSchema: {
        type: "object",
        properties: {
          type: { const: "camera" },
        }
      }
    });
    Core.SceneJsonParser.addModuleParser('light', {
      fromJson: (m) => this.lightFromJson(m),
      toJson: (m) => this.lightToJson(m),
      jsonSchema: {
        type: "object",
        properties: {
          type: { const: "light" },
          lightType: {
            type: "string",
            enum: Object.values(LightType)
          },
          intensity: { type: "number" },
          castShadows: { type: "boolean" },
          color: { "$ref": "#/$defs/color" },
          directionalVector: { "$ref": "#/$defs/vector3" },
        }
      }
    });
    Core.SceneJsonParser.addModuleParser('mesh', {
      fromJson: (m) => this.meshFromJson(m),
      toJson: (m) => this.meshToJson(m),
      jsonSchema: {
        type: "object",
        properties: {
          type: { const: "mesh" },
          geometryType: {
            type: "string",
            enum: Object.values(GeometryType)
          },
          materialType: {
            type: "string",
            enum: Object.values(MaterialType)
          },
        }
      }
    });
  }
  removeEvents() {
    Core.SceneJsonParser.removeModuleParser('camera');
    Core.SceneJsonParser.removeModuleParser('light');
    Core.SceneJsonParser.removeModuleParser('mesh');
  }

  private cameraFromJson(module: any): InstanceType<typeof Core.Module> {
    return new CameraModule();
  }
  private cameraToJson(module: InstanceType<typeof Core.Module>): any {
    const camera = module as CameraModule;
    return {
      type: "camera",
    };
  }

  private lightFromJson(module: any): InstanceType<typeof Core.Module> {
    let light: LightModule;
    switch (module.lightType) {
      default:
      case LightType.Ambient:
        light = new LightModule(LightType.Ambient);
        break;
      case LightType.Directional:
        light = new LightModule(LightType.Directional);
        break;
      case LightType.Point:
        light = new LightModule(LightType.Point);
        break;
      case LightType.Spot:
        light = new LightModule(LightType.Spot);
        break;
    }
    light.intensity = module.intensity ?? 1;
    light.castShadows = module.castShadows ?? false;
    light.color = module.color ?
      new Core.Color(module.color) :
      new Core.Color(1, 1, 1);
    light.directionalLightVector = module.directionalVector ?
      new Core.Vector3(
        module.directionalVector.x,
        module.directionalVector.y,
        module.directionalVector.z,
      ) :
      new Core.Vector3(0, 1, 0);
    // todo: add support for referencing other entitieis
    // light.target = 


    return light
  }
  private lightToJson(module: InstanceType<typeof Core.Module>): any {
    const light = module as LightModule;
    return {
      type: "light",
    };
  }

  private meshFromJson(module: any): InstanceType<typeof Core.Module> {
    const mesh = new MeshModule();
    mesh.setGeometry(new Geometry(GeometryType.BoxGeometry));
    mesh.setMaterial(new Material(MaterialType.MeshPhongMaterial));
    return mesh;
  }
  private meshToJson(module: InstanceType<typeof Core.Module>): any {
    const mesh = module as MeshModule;
    return {
      type: "mesh",
    };
  }
}