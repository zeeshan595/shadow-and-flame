import type { Texture } from "./texture";
import * as THREE from 'three';
import { Core } from '../core';

export enum MaterialType {
  MeshBasicMaterial = 'MeshBasicMaterial',
  MeshStandardMaterial = 'MeshStandardMaterial',
  MeshPhongMaterial = 'MeshPhongMaterial',
  SpriteMaterial = 'SpriteMaterial',
}

export class Material {
  private _material: THREE.Material;

  get color(): InstanceType<typeof Core.Color> {
    const mat = this._material as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial | THREE.MeshPhongMaterial;
    return new Core.Color(mat.color.r, mat.color.g, mat.color.b);
  }
  set color(value: InstanceType<typeof Core.Color>) {
    const mat = this._material as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial | THREE.MeshPhongMaterial;
    mat.color = new THREE.Color(value.r, value.g, value.b);
  }
  get opacity(): number {
    const mat = this._material as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial | THREE.MeshPhongMaterial;
    return mat.opacity;
  }
  set opacity(value: number) {
    const mat = this._material as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial | THREE.MeshPhongMaterial;
    mat.opacity = value;
  }
  get enableAlphaBlending(): boolean {
    const mat = this._material as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial | THREE.MeshPhongMaterial;
    return mat.transparent;
  }
  set enableAlphaBlending(value: boolean) {
    const mat = this._material as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial | THREE.MeshPhongMaterial;
    mat.transparent = value;
  }

  constructor(public readonly type?: MaterialType) {
    if (!type) {
      type = MaterialType.MeshPhongMaterial;
    }
    switch (type) {
      default:
      case MaterialType.MeshBasicMaterial:
        this._material = new THREE.MeshBasicMaterial();
        break;
      case MaterialType.MeshStandardMaterial:
        this._material = new THREE.MeshStandardMaterial();
        break;
      case MaterialType.SpriteMaterial:
        this._material = new THREE.SpriteMaterial();
        break;
      case MaterialType.MeshPhongMaterial:
        this._material = new THREE.MeshPhongMaterial();
        break;
    }
  }

  get handler(): THREE.Material {
    return this._material;
  }

  setTexture(texture: Texture): void {
    if ('map' in this._material) {
      this._material.map = texture.handler;
    } else {
      throw new Error('material does not support texture');
    }
  }
}