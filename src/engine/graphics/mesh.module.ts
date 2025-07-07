import type { Material } from "./material";
import { addThreeJsObjectToScene, removeThreeJsObjectFromScene } from "./scene.manager";
import { Module } from "@/engine/core/module";
import { Geometry } from "./geometry";
import * as THREE from 'three';

export class MeshModule extends Module {
  private _handler: THREE.Mesh;

  get receiveShadow(): boolean {
    return this._handler.receiveShadow;
  }
  set receiveShadow(value: boolean) {
    this._handler.receiveShadow = value;
  }
  get castShadow(): boolean {
    return this._handler.castShadow;
  }
  set castShadow(value: boolean) {
    this._handler.castShadow = value;
  }

  constructor() {
    super("renderer");
    this._handler = new THREE.Mesh();
    this._handler.receiveShadow = true;
    this._handler.castShadow = true;
  }

  public onAttached(): void {
    addThreeJsObjectToScene(this.uuid, this._handler, this.entity.uuid);
  }

  public onDetached(): void {
    removeThreeJsObjectFromScene(this.uuid);
  }

  setMaterial(material: Material): void {
    this._handler.material = material.handler;
  }
  setGeometry(geometry: Geometry): void {
    this._handler.geometry = geometry.handler;
  }
}