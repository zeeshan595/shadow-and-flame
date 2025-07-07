import * as CameraImport from './camera.module';
import * as MeshImport from './mesh.module';
import * as LightImport from './light.module';
import * as RenderImport from './render.system';
import * as MaterialImport from './material';
import * as TextureImport from './texture';
import * as GeometryImport from './geometry';

export namespace Graphics {
  // camera
  export const CameraModule = CameraImport.CameraModule;
  export const CameraType = CameraImport.CameraType;

  // mesh
  export const MeshModule = MeshImport.MeshModule;

  // light
  export const LightModule = LightImport.LightModule;
  export const LightType = LightImport.LightType;

  // renderer
  export const RendererSystem = RenderImport.RenderSystem;

  // material
  export const Material = MaterialImport.Material;
  export const MaterialType = MaterialImport.MaterialType;

  // texture
  export const Texture = TextureImport.Texture;

  // geometry
  export const Geometry = GeometryImport.Geometry;
  export const GeometryType = GeometryImport.GeometryType;
}