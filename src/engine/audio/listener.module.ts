import { Core } from "@/engine/core";
import * as THREE from "three";

export const _static_listener = new THREE.AudioListener();

export class ListenerModule extends Core.Module {
  private _object: THREE.Object3D;
  public static singleton?: ListenerModule;

  constructor() {
    super('listener');
    this._object = new THREE.Object3D();
    this._object.add(_static_listener);
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