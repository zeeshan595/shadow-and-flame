import { Core } from ".";

export type ModuleJsonParserType = {
  fromJson: (module: any) => InstanceType<typeof Core.Module>;
  toJson: (module: InstanceType<typeof Core.Module>) => any;
  jsonSchema?: any;
};

export type ObjectJsonparserType = {
  fromJson: (object: any) => any;
  toJson: (object: any) => any;
  jsonSchema?: any;
};

export class JsonParser {
  private static readonly _version = "0.0.1";
  private static _moduleLoaders = new Map<string, ModuleJsonParserType>();
  private static _objectParsers = new Map<string, ObjectJsonparserType>();

  /**
   * pass a json object to load a scene
   * @param json parsed json object
   * @returns a scene instance or null if failed to load
   */
  static fromJson(json: any): InstanceType<typeof Core.Scene> | null {
    try {
      const scene = new Core.Scene();
      if (json.version !== JsonParser._version) {
        console.warn(`json version mismatch: ${json.version} !== ${JsonParser._version}`);
      }
      for (const entityJson of json.entities) {
        JsonParser.entityFromJson(scene, entityJson);
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
  static toJson(scene: InstanceType<typeof Core.Scene>): any {
    const entities: any[] = [];
    for (const entity of scene.entities) {
      entities.push(JsonParser.entityToJson(entity));
    }
    return {
      version: JsonParser._version,
      entities
    }
  }

  static getSchema() {
    const modulesSchema = [...JsonParser._moduleLoaders.keys()].map(key => {
      const module = JsonParser._moduleLoaders.get(key)!;
      return { [key]: module.jsonSchema };
    });
    const moduleRefs = [...JsonParser._moduleLoaders.keys()].map(
      key => ({ "$ref": `#/$defs/modules/${key}` })
    );
    const objectSchema = [...JsonParser._objectParsers.keys()].map(key => {
      const module = JsonParser._objectParsers.get(key)!;
      return { [key]: module.jsonSchema };
    });
    return {
      type: "object",
      properties: {
        version: {
          const: JsonParser._version
        },
        entities: {
          type: "array",
          items: JsonParser.getEntitySchemaRef()
        }
      },
      "$defs": {
        entity: {
          type: "object",
          properties: {
            name: { type: "string" },
            transform: {
              type: "object",
              properties: {
                position: {
                  "$ref": JsonParser.getObjectSchemaRef('vector3')
                },
                rotation: {
                  "$ref": JsonParser.getObjectSchemaRef('quaternion')
                },
                scale: {
                  "$ref": JsonParser.getObjectSchemaRef('vector3')
                }
              }
            },
            children: {
              type: "array",
              items: JsonParser.getEntitySchemaRef()
            },
            modules: {
              type: "array",
              items: {
                "oneOf": moduleRefs
              }
            }
          }
        },
        modules: {
          ...modulesSchema.reduce((acc, schema) => ({ ...acc, ...schema }), {})
        },
        objects: {
          ...objectSchema.reduce((acc, schema) => ({ ...acc, ...schema }), {}),
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
              "$eulerAngles": {
                type: "object",
                properties: {
                  x: { type: "number" },
                  y: { type: "number" },
                  z: { type: "number" },
                }
              }
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
    }
  };
  static getEntitySchemaRef() {
    return {
      $ref: `#/$defs/entity`
    };
  }
  static getModuleSchemaRef(moduleName: string) {
    return {
      $ref: `$#/$defs/modules/${moduleName}`
    };
  }
  static getObjectSchemaRef(objectName: string) {
    return {
      $ref: `$#/$defs/objects/${objectName}`
    };
  }

  // module parser
  static addModuleParser(
    type: string,
    parser: ModuleJsonParserType
  ) {
    if (JsonParser._moduleLoaders.has(type)) {
      console.warn(`Module loader for type ${type} already exists`);
      return;
    }
    JsonParser._moduleLoaders.set(type, parser);
  }
  static removeModuleParser(type: string) {
    JsonParser._moduleLoaders.delete(type);
  }
  // object parsers
  static addObjectParser(type: string, parser: ObjectJsonparserType) {
    if (JsonParser._objectParsers.has(type)) {
      console.warn(`Object parser for type ${type} already exists`);
      return;
    }
    JsonParser._objectParsers.set(type, parser);
  }
  static removeObjectParser(type: string) {
    JsonParser._objectParsers.delete(type);
  }

  // parse from json helpers
  private static transformFromJson(
    entity: InstanceType<typeof Core.Entity>,
    transformJson?: any
  ) {
    if (!transformJson) return;
    if ('position' in transformJson) {
      entity.transform.position = JsonParser.vector3FromJson(
        transformJson.position,
      );
    }
    if ('rotation' in transformJson) {
      entity.transform.rotation = JsonParser.quaternionFromJson(
        transformJson.rotation,
      );
    }
    if ('scale' in transformJson) {
      entity.transform.scale = JsonParser.vector3FromJson(
        transformJson.scale,
        new Core.Vector3(1, 1, 1)
      );
    }
  }
  private static moduleFromJson(module: any): InstanceType<typeof Core.Module> | null {
    const loader = JsonParser._moduleLoaders.get(module.type);
    if (!loader) {
      console.warn(`Module type ${module.type} not found`);
      return null;
    }
    return loader.fromJson(module);
  }
  private static entityFromJson(
    scene: InstanceType<typeof Core.Scene>,
    entityJson: any
  ): InstanceType<typeof Core.Entity> | null {
    const entity = new Core.Entity(entityJson.name);
    entity.tags = new Set(entityJson.tags);
    JsonParser.transformFromJson(entity, entityJson.transform);
    for (const moduleJson of entityJson.modules ?? []) {
      const module = JsonParser.moduleFromJson(moduleJson);
      if (!module) continue;
      entity.addModule(module);
    }
    scene.addEntity(entity);
    for (const childJson of entityJson.children ?? []) {
      const child = JsonParser.entityFromJson(scene, childJson);
      if (!child) continue;
      scene.addEntity(child, entity);
    }
    return entity;
  }

  // parse to json helpers
  private static transformToJson(
    entity: InstanceType<typeof Core.Entity>
  ): any {
    return {
      position: this.vector3ToJson(entity.transform.position),
      rotation: this.quaternionToJson(entity.transform.rotation),
      scale: this.vector3ToJson(entity.transform.scale)
    }
  }
  private static moduleToJson(
    module: InstanceType<typeof Core.Module>
  ): any | null {
    const type = module.getModuleType();
    const loader = JsonParser._moduleLoaders.get(type);
    if (!loader) {
      console.warn(`Module type ${type} not found`);
      return null;
    }
    return loader.toJson(module);
  }
  private static entityToJson(
    entity: InstanceType<typeof Core.Entity>
  ): any {
    const name = entity.name;
    const tags = [...entity.tags];
    const transform = JsonParser.transformToJson(entity);
    const modules: any[] = [];
    for (const module of Object.values(entity.getModules())) {
      const moduleJson = JsonParser.moduleToJson(module);
      if (!moduleJson) continue;
      modules.push(moduleJson);
    }
    const children = [...entity.getChildren()].map(child => JsonParser.entityToJson(child));

    return {
      name,
      tags,
      transform,
      modules,
      children
    };
  }

  // basic parsers
  static vector3FromJson(
    json: any,
    defaultValue = new Core.Vector3(0, 0, 0)
  ): InstanceType<typeof Core.Vector3> {
    if (!json) {
      return defaultValue;
    }
    return new Core.Vector3(
      json.x,
      json.y,
      json.z
    );
  }
  static vector3ToJson(vector: InstanceType<typeof Core.Vector3>): any {
    return {
      x: vector.x,
      y: vector.y,
      z: vector.z
    }
  }
  static quaternionFromJson(
    json: any,
    defaultValue = new Core.Quaternion(0, 0, 0, 1)
  ): InstanceType<typeof Core.Quaternion> {
    if (!json) {
      return defaultValue;
    }
    if ('$eulerAngles' in json) {
      return Core.Quaternion.fromEulerAngles(
        json.$eulerAngles.x,
        json.$eulerAngles.y,
        json.$eulerAngles.z
      );
    }
    return new Core.Quaternion(
      json.x,
      json.y,
      json.z,
      json.w
    );
  }
  static quaternionToJson(quaternion: InstanceType<typeof Core.Quaternion>): any {
    return {
      x: quaternion.x,
      y: quaternion.y,
      z: quaternion.z,
      w: quaternion.w
    }
  }
  static colorFromJson(
    json: any,
    defaultValue = new Core.Color(0, 0, 0, 1)
  ): InstanceType<typeof Core.Color> {
    if (!json) {
      return defaultValue;
    }
    return new Core.Color(
      json.r,
      json.g,
      json.b,
      json.a
    );
  }
  static colorToJson(color: InstanceType<typeof Core.Color>): any {
    return {
      r: color.r,
      g: color.g,
      b: color.b,
      a: color.a
    }
  }
}