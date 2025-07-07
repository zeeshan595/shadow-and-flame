import * as THREE from 'three';
import { Vector2 } from "@/engine/core/vector";
import { engine, EngineEventType } from "@/engine/core/engine";
import { System } from "@/engine/core/system";
import { ThreeJsSceneManager } from './scene.manager';
import { Core } from '../core';

export class RenderSystem extends System {
  private readonly _handler: THREE.WebGLRenderer;

  constructor() {
    super();
    this._handler = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this._handler.setSize(innerWidth, innerHeight);

    // setup DOM canvas
    this._handler.domElement.id = "canvas";
    document.body.appendChild(this._handler.domElement);

    // renderer properties
    this._handler.outputColorSpace = THREE.SRGBColorSpace;
    this._handler.toneMapping = THREE.ACESFilmicToneMapping;
    this._handler.toneMappingExposure = 1.0;
    this._handler.shadowMap.enabled = true;

    addEventListener('resize', (e) => this.onResize(e));
    this._handler.setAnimationLoop(() => engine.onRender());
    engine.scene.addThirdPartySceneManager(
      Core.SupportedThirdPartySceneManager.ThreeJs, new ThreeJsSceneManager()
    );
    engine.addEventListener(EngineEventType.SceneChanged, () => this.onEngineSceneChanged());
  }

  private onEngineSceneChanged() {
    engine.scene.addThirdPartySceneManager(
      Core.SupportedThirdPartySceneManager.ThreeJs, new ThreeJsSceneManager()
    );
  }

  private onResize(_e: UIEvent) {
    this._handler.setSize(innerWidth, innerHeight);
  }

  get handler(): THREE.WebGLRenderer {
    return this._handler;
  }

  setSize(width: number, height: number): void {
    this._handler.setSize(width, height);
  }
  getSize(): Vector2 {
    const size = this._handler.getSize(new THREE.Vector2());
    return new Vector2(size.width, size.height);
  }

  override onRender() {
    const sceneManager = engine.scene.getThirdPartySceneManager(
      Core.SupportedThirdPartySceneManager.ThreeJs
    ) as ThreeJsSceneManager;
    for (const camera of sceneManager.cameras) {
      this._handler.render(
        sceneManager.scene, camera
      );
    }
  }
}