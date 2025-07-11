import { Core } from ".";

export type ModuleJsonType = {
  type: string,
  [key: string]: string;
};

export type TransformJsonType = {
  position?: {
    x: number,
    y: number,
    z: number
  },
  rotation?: {
    x: number,
    y: number,
    z: number,
    w: number
  },
  scale?: {
    x: number,
    y: number,
    z: number
  }
};

export type EntityJsonType = {
  name?: string,
  transform?: TransformJsonType;
  children?: EntityJsonType[],
  modules?: ModuleJsonType[],
};

export type SceneJsonType = {
  entities: EntityJsonType[];
};

export type ModuleJsonParserType = {
  fromJson: (module: ModuleJsonType) => InstanceType<typeof Core.Module>;
  toJson: (module: InstanceType<typeof Core.Module>) => ModuleJsonType;
  jsonSchema?: any;
};

export class SceneJsonParser {
  private static _moduleLoaders = new Map<string, ModuleJsonParserType>();

  /**
   * pass a json object to load a scene
   * @param json parsed json object
   * @returns a scene instance or null if failed to load
   */
  static fromJson(json: SceneJsonType): InstanceType<typeof Core.Scene> | null {
    try {
      const scene = new Core.Scene();
      for (const entityJson of json.entities) {
        SceneJsonParser.entityFromJson(scene, entityJson);
      }
      return scene;
    } catch (e) {
      console.warn(`failed to load json: ${e}`);
      return null;
    }
  }

  /**
   * convert a scene to json
   * @param scene the scene to convert
   * @returns json object
   */
  static toJson(scene: InstanceType<typeof Core.Scene>): SceneJsonType {
    const entities: EntityJsonType[] = [];
    for (const entity of scene.entities) {
      entities.push(SceneJsonParser.entityToJson(entity));
    }
    return {
      entities
    }
  }

  static getSchema() {
    const modulesSchema = [...this._moduleLoaders.keys()].map(key => {
      const module = this._moduleLoaders.get(key)!;
      return { [key]: module.jsonSchema };
    });
    const moduleRefs = [...this._moduleLoaders.keys()].map(
      key => ({ "$ref": `#/$defs/${key}` })
    );
    return {
      type: "object",
      properties: {
        entities: {
          "type": "array",
          "items": { "$ref": "#/$defs/entity" }
        }
      },
      "$defs": {
        ...modulesSchema.reduce((acc, schema) => ({ ...acc, ...schema }), {}),
        entity: {
          type: "object",
          properties: {
            name: { type: "string" },
            transform: {
              type: "object",
              properties: {
                position: {
                  "$ref": "#/$defs/vector3"
                },
                rotation: {
                  "$ref": "#/$defs/quaternion"
                },
                scale: {
                  "$ref": "#/$defs/vector3"
                }
              }
            },
            children: {
              type: "array",
              items: { "$ref": "#/$defs/entity" }
            },
            modules: {
              type: "array",
              items: {
                "oneOf": moduleRefs
              }
            }
          }
        },
        vector3: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" },
            z: { type: "number" },
          }
        },
        quaternion: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" },
            z: { type: "number" },
            w: { type: "number" },
          }
        },
        color: {
          type: "object",
          properties: {
            r: { type: "number" },
            g: { type: "number" },
            b: { type: "number" },
            a: { type: "number" },
          }
        }
      }
    }
  };

  // module parser
  static addModuleParser(
    type: string,
    parser: ModuleJsonParserType
  ) {
    if (SceneJsonParser._moduleLoaders.has(type)) {
      console.warn(`Module loader for type ${type} already exists`);
      return;
    }
    SceneJsonParser._moduleLoaders.set(type, parser);
  }
  static removeModuleParser(type: string) {
    SceneJsonParser._moduleLoaders.delete(type);
  }

  // parse from json helpers
  private static transformFromJson(
    entity: InstanceType<typeof Core.Entity>,
    transformJson?: TransformJsonType
  ) {
    if (!transformJson) return;
    if (transformJson.position) {
      entity.transform.position = new Core.Vector3(
        transformJson.position.x,
        transformJson.position.y,
        transformJson.position.z
      );
    }
    if (transformJson.rotation) {
      entity.transform.rotation = new Core.Quaternion(
        transformJson.rotation.x,
        transformJson.rotation.y,
        transformJson.rotation.z,
        transformJson.rotation.w
      );
    }
    if (transformJson.scale) {
      entity.transform.scale = new Core.Vector3(
        transformJson.scale.x,
        transformJson.scale.y,
        transformJson.scale.z
      );
    }
  }
  private static moduleFromJson(module: ModuleJsonType): InstanceType<typeof Core.Module> | null {
    const loader = SceneJsonParser._moduleLoaders.get(module.type);
    if (!loader) {
      console.warn(`Module type ${module.type} not found`);
      return null;
    }
    return loader.fromJson(module);
  }
  private static entityFromJson(
    scene: InstanceType<typeof Core.Scene>,
    entityJson: EntityJsonType
  ): InstanceType<typeof Core.Entity> | null {
    const entity = new Core.Entity(entityJson.name);
    SceneJsonParser.transformFromJson(entity, entityJson.transform);
    for (const moduleJson of entityJson.modules ?? []) {
      const module = SceneJsonParser.moduleFromJson(moduleJson);
      if (!module) continue;
      entity.addModule(module);
    }
    scene.addEntity(entity);
    for (const childJson of entityJson.children ?? []) {
      const child = SceneJsonParser.entityFromJson(scene, childJson);
      if (!child) continue;
      scene.addEntity(child, entity);
    }
    return entity;
  }

  // parse to json helpers
  private static transformToJson(
    entity: InstanceType<typeof Core.Entity>
  ): TransformJsonType {
    return {
      position: {
        x: entity.transform.position.x,
        y: entity.transform.position.y,
        z: entity.transform.position.z
      },
      rotation: {
        x: entity.transform.rotation.x,
        y: entity.transform.rotation.y,
        z: entity.transform.rotation.z,
        w: entity.transform.rotation.w
      },
      scale: {
        x: entity.transform.scale.x,
        y: entity.transform.scale.y,
        z: entity.transform.scale.z
      }
    }
  }
  private static moduleToJson(
    module: InstanceType<typeof Core.Module>
  ): ModuleJsonType | null {
    const type = module.getModuleType();
    const loader = SceneJsonParser._moduleLoaders.get(type);
    if (!loader) {
      console.warn(`Module type ${type} not found`);
      return null;
    }
    return loader.toJson(module);
  }
  private static entityToJson(
    entity: InstanceType<typeof Core.Entity>
  ): EntityJsonType {
    const name = entity.name;
    const transform = SceneJsonParser.transformToJson(entity);
    const modules: ModuleJsonType[] = [];
    for (const module of Object.values(entity.getModules())) {
      const moduleJson = SceneJsonParser.moduleToJson(module);
      if (!moduleJson) continue;
      modules.push(moduleJson);
    }
    const children = [...entity.getChildren()].map(child => SceneJsonParser.entityToJson(child));

    return {
      name,
      transform,
      modules,
      children
    };
  }
}