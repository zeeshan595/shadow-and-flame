import { Core } from "../core";
import * as THREE from "three";

export enum LightType {
  Directional = "directional",
  Point = "point",
  Spot = "spot",
  Ambient = "ambient",
}

export type OrthographicShadowCameraProperties = {
  near: number;
  far: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export type PerspectiveShadowCameraProperties = {
  near: number;
  far: number;
  fov: number;
  aspect: number;
}

export class LightModule extends Core.Module {
  private _handler: THREE.Light;
  private _directionalLightVector: THREE.Vector3;
  private _target?: InstanceType<typeof Core.Entity>;

  get intensity(): number {
    return this._handler.intensity;
  }
  set intensity(value: number) {
    this._handler.intensity = value;
  }
  get color(): InstanceType<typeof Core.Color> {
    const col = this._handler.color;
    return new Core.Color(col.r, col.g, col.b);
  }
  set color(value: InstanceType<typeof Core.Color>) {
    this._handler.color.setRGB(value.r, value.g, value.b);
  }
  get castShadows(): boolean {
    return this._handler.castShadow;
  }
  set castShadows(value: boolean) {
    this._handler.castShadow = value;
  }
  set target(value: InstanceType<typeof Core.Entity>) {
    this._target = value;
  }
  get target(): InstanceType<typeof Core.Entity> | undefined {
    return this._target;
  }
  set directionalLightVector(value: InstanceType<typeof Core.Vector3>) {
    this._directionalLightVector.set(value.x, value.y, value.z);
  }
  get directionalLightVector(): InstanceType<typeof Core.Vector3> {
    return new Core.Vector3(
      this._directionalLightVector.x,
      this._directionalLightVector.y,
      this._directionalLightVector.z
    );
  }
  get shadowCameraProperties(): OrthographicShadowCameraProperties | PerspectiveShadowCameraProperties | null {
    switch (this.type) {
      case LightType.Directional:
        const lightD = this._handler as THREE.DirectionalLight;
        return {
          near: lightD.shadow.camera.near,
          far: lightD.shadow.camera.far,
          left: lightD.shadow.camera.left,
          right: lightD.shadow.camera.right,
          top: lightD.shadow.camera.top,
          bottom: lightD.shadow.camera.bottom,
        } as OrthographicShadowCameraProperties;
      case LightType.Point:
      case LightType.Spot:
        const lightPS = this._handler as THREE.PointLight | THREE.SpotLight;
        return {
          near: lightPS.shadow.camera.near,
          far: lightPS.shadow.camera.far,
          fov: lightPS.shadow.camera.fov,
          aspect: lightPS.shadow.camera.aspect,
        } as PerspectiveShadowCameraProperties;
    }
    return null;
  }
  set shadowCameraProperties(value: OrthographicShadowCameraProperties | PerspectiveShadowCameraProperties) {
    switch (this.type) {
      case LightType.Directional:
        {
          const light = this._handler as THREE.DirectionalLight;
          const valueO = value as OrthographicShadowCameraProperties;
          light.shadow.camera.near = valueO.near;
          light.shadow.camera.far = valueO.far;
          light.shadow.camera.left = valueO.left;
          light.shadow.camera.right = valueO.right;
          light.shadow.camera.top = valueO.top;
          light.shadow.camera.bottom = valueO.bottom;
        }
        break;
      case LightType.Point:
      case LightType.Spot:
        {
          const light = this._handler as THREE.PointLight | THREE.SpotLight;
          const valueP = value as PerspectiveShadowCameraProperties;
          light.shadow.camera.near = valueP.near;
          light.shadow.camera.far = valueP.far;
          light.shadow.camera.fov = valueP.fov;
          light.shadow.camera.aspect = valueP.aspect;
        }
        break;
    }
  }

  constructor(public readonly type: LightType = LightType.Ambient) {
    super('light');
    this._directionalLightVector = new THREE.Vector3(0, -1, 0);
    switch (type) {
      case LightType.Directional:
        this._handler = new THREE.DirectionalLight();
        break;
      case LightType.Point:
        this._handler = new THREE.PointLight();
        break;
      case LightType.Spot:
        this._handler = new THREE.SpotLight();
        break;
      case LightType.Ambient:
        this._handler = new THREE.AmbientLight();
        break;
    }
    this._handler.uuid = this.uuid;
  }
  public override onRender(): void {
    if (this.type === LightType.Directional) {
      const handler = this._handler as THREE.DirectionalLight;

      let directionalLightVector = this.directionalLightVector.multiply(-1);
      if (this._target) {
        // const sceneManager = Core.engine.scene.getThirdPartySceneManager(
        //   Core.SupportedThirdPartySceneManager.ThreeJs
        // ) as ThreeJsSceneManager;
        // const targetRef = sceneManager.get(this._target.uuid);
        // if (!targetRef) {
        //   throw new Error(`target ${this._target.uuid} not found`);
        // }
        // if (handler.target != targetRef)
        //   handler.target = targetRef;
        // directionalLightVector = this.target!.transform.position.add(directionalLightVector);
      }
      handler.position.set(
        directionalLightVector.x,
        directionalLightVector.y,
        directionalLightVector.z
      );
    }
  }
}