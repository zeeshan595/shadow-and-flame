import { Core } from '@/engine';
import { CameraModule } from './camera.module';
import { LightModule, LightType } from './light.module';
import { MeshModule } from './mesh.module';
import { Material, MaterialType } from './material';
import { Geometry, GeometryType } from './geometry';

export class GraphicsLoader {
  addEvents() {
    Core.JsonParser.addModuleParser('camera', {
      fromJson: (m) => this.cameraFromJson(m),
      toJson: (m) => this.cameraToJson(m),
      jsonSchema: {
        type: "object",
        properties: {
          type: { const: "camera" },
        }
      }
    });
    Core.JsonParser.addModuleParser('light', {
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
          color: Core.JsonParser.getObjectSchemaRef('color'),
          directionalVector: Core.JsonParser.getObjectSchemaRef('vector3'),
        }
      }
    });
    Core.JsonParser.addModuleParser('mesh', {
      fromJson: (m) => this.meshFromJson(m),
      toJson: (m) => this.meshToJson(m),
      jsonSchema: {
        type: "object",
        properties: {
          type: { const: "mesh" },
          gemoetry: Core.JsonParser.getObjectSchemaRef("geometry"),
          material: Core.JsonParser.getObjectSchemaRef("material"),
        }
      }
    });
    Core.JsonParser.addObjectParser('material', {
      fromJson: (m) => this.materialFromJson(m),
      toJson: (m) => this.materialToJson(m),
      jsonSchema: {
        type: "object",
        properties: {
          type: { const: "material" },
          opacity: { type: "number" },
          enableAlphaBlending: { type: "boolean" },
        }
      }
    });
    Core.JsonParser.addObjectParser('geometry', {
      fromJson: (m) => this.geometryFromJson(m),
      toJson: (m) => this.geometryToJson(m),
      jsonSchema: {
        type: "object",
        properties: {
          type: { const: "geometry" },
        }
      }
    });
  }
  removeEvents() {
    Core.JsonParser.removeObjectParser('material');
    Core.JsonParser.removeObjectParser('geometry');
    Core.JsonParser.removeModuleParser('camera');
    Core.JsonParser.removeModuleParser('light');
    Core.JsonParser.removeModuleParser('mesh');
  }

  private cameraFromJson(_: any): InstanceType<typeof Core.Module> {
    return new CameraModule();
  }
  private cameraToJson(_: InstanceType<typeof Core.Module>): any {
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
    light.color = Core.JsonParser.colorFromJson(module.color, new Core.Color(1, 1, 1, 1));
    light.directionalLightVector = Core.JsonParser.vector3FromJson(module.directionalVector);

    return light
  }
  private lightToJson(_: InstanceType<typeof Core.Module>): any {
    return {
      type: "light",
    };
  }

  private meshFromJson(module: any): InstanceType<typeof Core.Module> {
    const mesh = new MeshModule();
    mesh.setGeometry(this.geometryFromJson(module.geometry));
    mesh.setMaterial(this.materialFromJson(module.material));
    return mesh;
  }
  private meshToJson(_: InstanceType<typeof Core.Module>): any {
    return {
      type: "mesh",
    };
  }

  private materialFromJson(json: any): Material {
    if (!json) {
      return new Material(MaterialType.MeshPhongMaterial);
    }
    const material = new Material(json.type);
    material.opacity = json.opacity ?? 1;
    material.enableAlphaBlending = json.enableAlphaBlending ?? false;
    return material;
  }
  private materialToJson(module: Material): any {
    return {
      type: module.type,
      opacity: module.opacity,
      enableAlphaBlending: module.enableAlphaBlending
    };
  }

  private geometryFromJson(json: any): Geometry {
    if (!json) {
      return new Geometry(GeometryType.BoxGeometry);
    }
    const geometry = new Geometry(json.type);
    return geometry;
  }
  private geometryToJson(module: Geometry): any {
    return {
      type: module.type
    };
  }
}