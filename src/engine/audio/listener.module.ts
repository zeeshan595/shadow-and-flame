import { Core } from "@/engine/core";
import * as THREE from "three";
import { addThreeJsObjectToScene, removeThreeJsObjectFromScene } from "../graphics/scene.manager";

export const _static_listener = new THREE.AudioListener();

export class ListenerModule extends Core.Module {
  private _object: THREE.Object3D;
  public static singleton?: ListenerModule;

  constructor() {
    super('listener');
    this._object = new THREE.Object3D();
    this._object.add(_static_listener);
  }

  override onAttached(): void {
    addThreeJsObjectToScene(this.uuid, this._object, this.entity.uuid);
  }

  override onDetached(): void {
    removeThreeJsObjectFromScene(this.uuid);
  }

  override onRender(): void {
    super.onRender();
    if (!ListenerModule.singleton) {
      ListenerModule.singleton = this;
    }
    if (ListenerModule.singleton !== this) {
      throw new Error('ListenerModule is a singleton, you have multiple instances');
    }
  }
}