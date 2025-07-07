import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export class Texture {
  private _handler: THREE.Texture;

  constructor(url?: string) {
    if (url) {
      this._handler = textureLoader.load(url);
    } else {
      this._handler = new THREE.Texture();
    }
    this._handler.wrapS = THREE.RepeatWrapping;
    this._handler.wrapT = THREE.RepeatWrapping;
    this._handler.magFilter = THREE.NearestFilter;
    this._handler.colorSpace = THREE.SRGBColorSpace;
    this._handler.repeat.set(1, 1);
  }

  get handler(): THREE.Texture {
    return this._handler;
  }
  async setTextureFromUrl(url: string): Promise<void> {
    this._handler = await textureLoader.loadAsync(url);
  }
}