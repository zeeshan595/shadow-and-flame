import * as EngineImport from './engine';
import * as EntityImport from './entity';
import * as ModuleImport from './module';
import * as SystemImport from './system';
import * as SceneImport from './scene';
import * as TransformImport from './transform';
import * as VectorImport from './vector';
import * as ColorImport from './color';
import * as SearchImport from './search';
import * as QuaternionImport from './quaternion'
import * as EventsImport from './events';
import * as jsonParserImport from './json.parser';

export namespace Core {
  // engine
  export const Engine = EngineImport.Engine;
  export const engine = EngineImport.engine;
  export const EngineEventType = EngineImport.EngineEventType;
  export const Events = EventsImport.Events;
  export const EventType = EventsImport.EventType;

  // scene json parser
  export const JsonParser = jsonParserImport.JsonParser;

  // scene, entity & modules
  export const Entity = EntityImport.Entity;
  export const EntityType = EntityImport.EntityType;
  export const Module = ModuleImport.Module;
  export const System = SystemImport.System;
  export const Scene = SceneImport.Scene;

  // data types
  export const Transform = TransformImport.Transform;
  export const Vector2 = VectorImport.Vector2;
  export const Vector3 = VectorImport.Vector3;
  export const Vector4 = VectorImport.Vector4;
  export const Color = ColorImport.Color;
  export const search = SearchImport.search;
  export const Quaternion = QuaternionImport.Quaternion;
}