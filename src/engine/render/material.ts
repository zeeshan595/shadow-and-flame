import * as THREE from 'three';
import type { Texture } from "./texture";

export enum MaterialType {
  MeshBasicMaterial = 'MeshBasicMaterial',
  MeshStandardMaterial = 'MeshStandardMaterial',
  SpriteMaterial = 'SpriteMaterial',
}

export class Material {
  private _material: THREE.Material;

  constructor(public readonly type?: MaterialType) {
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