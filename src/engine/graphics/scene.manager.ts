import { Core } from "../core";
import * as THREE from 'three';

export class ThreeJsSceneManager extends Core.ThirdPartySceneManager<THREE.Object3D> {
  private _cameras: Map<string, THREE.Camera> = new Map();
  private _scene = new THREE.Scene();

  constructor() {
    super();
    this._scene.background = new THREE.Color('#24273A');
  }

  get cameras(): THREE.Camera[] {
    return [...this._cameras.values()];
  }
  override set(key: string, value: THREE.Object3D, parent?: string): void {
    if (value instanceof THREE.Camera) {
      this._cameras.set(key, value);
    }
    if (parent) {
      if (this._map.has(parent)) {
        this._map.get(parent)!.add(value);
      } else {
        throw new Error(`parent ${parent} not found for object ${key}`);
      }
    } else {
      this._scene.add(value);
    }
    return super.set(key, value);
  }
  override delete(key: string): void {
    if (this._cameras.has(key)) {
      this._cameras.delete(key);
    }
    if (this._map.has(key)) {
      const obj = this._map.get(key)!;
      obj.removeFromParent();
      obj.clear();
    }
    super.delete(key);
  }
  override newObject(_entity: InstanceType<typeof Core.Entity>): THREE.Object3D {
    return new THREE.Object3D();
  }
  get scene(): THREE.Scene {
    return this._scene;
  }
  override onRender(entities: InstanceType<typeof Core.Entity>[]): void {
    for (const entity of entities) {
      const threejsObject = this._map.get(entity.uuid);
      if (!threejsObject) continue;
      if (threejsObject instanceof THREE.DirectionalLight) continue;

      threejsObject.position.set(
        entity.transform.position.x,
        entity.transform.position.y,
        entity.transform.position.z
      );

      threejsObject.rotation.setFromQuaternion(
        new THREE.Quaternion(
          entity.transform.rotation.x,
          entity.transform.rotation.y,
          entity.transform.rotation.z,
          entity.transform.rotation.w
        )
      );

      threejsObject.scale.set(
        entity.transform.scale.x,
        entity.transform.scale.y,
        entity.transform.scale.z
      );
      this.onRender(entity.getChildren());
    }
  }
}

export function addThreeJsObjectToScene(uuid: string, obj: THREE.Object3D, parent?: string) {
  const sceneManager = Core.engine.scene.getThirdPartySceneManager(
    Core.SupportedThirdPartySceneManager.ThreeJs
  ) as ThreeJsSceneManager;
  sceneManager.set(uuid, obj, parent);
}

export function removeThreeJsObjectFromScene(uuid: string) {
  const sceneManager = Core.engine.scene.getThirdPartySceneManager(
    Core.SupportedThirdPartySceneManager.ThreeJs
  ) as ThreeJsSceneManager;
  sceneManager.delete(uuid);
}