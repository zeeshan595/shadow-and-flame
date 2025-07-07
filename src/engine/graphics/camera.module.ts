import { addThreeJsObjectToScene, removeThreeJsObjectFromScene } from "./scene.manager";
import { Module } from "@/engine/core/module";
import * as THREE from "three";

export enum CameraType {
  Orthographic = "orthographic",
  Perspective = "perspective",
}

export class CameraModule extends Module {
  private _handler: THREE.Camera;
  private _aspect;

  private _fov = 75; // Default field of view
  private _near = 0.1; // Default near clipping plane
  private _far = 1000; // Default far clipping plane

  private _left = -200; // Default left plane for orthographic camera
  private _right = 200; // Default right plane for orthographic camera
  private _top = 300; // Default top plane for orthographic camera
  private _bottom = -300; // Default bottom plane for orthographic camera

  constructor(public readonly type: CameraType = CameraType.Perspective) {
    super("camera");
    this._aspect = innerWidth / innerHeight;
    switch (type) {
      case CameraType.Orthographic:
        this._handler = new THREE.OrthographicCamera(
          this._left,
          this._right,
          this._top,
          this._bottom,
          this._near,
          this._far
        );
        break;
      case CameraType.Perspective:
        this._handler = new THREE.PerspectiveCamera(
          this._fov,
          this._aspect,
          this._near,
          this._far
        );
        break;
    }
  }

  public get fov(): number {
    return this._fov;
  }
  public set fov(value: number) {
    if (value <= 0 || value >= 180) {
      throw new Error(`Invalid field of view: ${value}. Must be between 0 and 180.`);
    }
    if (this.type !== CameraType.Perspective) {
      throw new Error(`Cannot set FOV for non-perspective camera type: ${this.type}`);
    }

    this._fov = value;
    (this._handler as THREE.PerspectiveCamera).fov = value;
    (this._handler as THREE.PerspectiveCamera).updateProjectionMatrix();
  }
  public get near(): number {
    return this._near;
  }
  public set near(value: number) {
    if (value <= 0) {
      throw new Error(`Invalid near plane: ${value}. Must be greater than 0.`);
    }
    this._near = value;
    (this._handler as THREE.PerspectiveCamera).near = value;
    (this._handler as THREE.PerspectiveCamera).updateProjectionMatrix();
  }
  public get far(): number {
    return this._far;
  }
  public set far(value: number) {
    if (value <= 0) {
      throw new Error(`Invalid far plane: ${value}. Must be greater than 0.`);
    }
    this._far = value;
    (this._handler as THREE.PerspectiveCamera).far = value;
    (this._handler as THREE.PerspectiveCamera).updateProjectionMatrix();
  }

  public get left(): number {
    return this._left;
  }
  public set left(value: number) {
    if (this.type !== CameraType.Orthographic) {
      throw new Error(`Cannot set left for non-orthographic camera type: ${this.type}`);
    }
    this._left = value;
    (this._handler as THREE.OrthographicCamera).left = value;
    (this._handler as THREE.OrthographicCamera).updateProjectionMatrix();
  }
  public get right(): number {
    return this._right;
  }
  public set right(value: number) {
    if (this.type !== CameraType.Orthographic) {
      throw new Error(`Cannot set right for non-orthographic camera type: ${this.type}`);
    }
    this._right = value;
    (this._handler as THREE.OrthographicCamera).right = value;
    (this._handler as THREE.OrthographicCamera).updateProjectionMatrix();
  }
  public get top(): number {
    return this._top;
  }
  public set top(value: number) {
    if (this.type !== CameraType.Orthographic) {
      throw new Error(`Cannot set top for non-orthographic camera type: ${this.type}`);
    }
    this._top = value;
    (this._handler as THREE.OrthographicCamera).top = value;
    (this._handler as THREE.OrthographicCamera).updateProjectionMatrix();
  }
  public get bottom(): number {
    return this._bottom;
  }
  public set bottom(value: number) {
    if (this.type !== CameraType.Orthographic) {
      throw new Error(`Cannot set bottom for non-orthographic camera type: ${this.type}`);
    }
    this._bottom = value;
    (this._handler as THREE.OrthographicCamera).bottom = value;
    (this._handler as THREE.OrthographicCamera).updateProjectionMatrix();
  }

  private onResize(_: UIEvent) {
    this._aspect = innerWidth / innerHeight;
    if (this.type === CameraType.Orthographic) {
      (this._handler as THREE.OrthographicCamera).right = this._aspect * this._right;
      (this._handler as THREE.OrthographicCamera).left = this._aspect * this._left;
      (this._handler as THREE.OrthographicCamera).updateProjectionMatrix();
    } else if (this.type === CameraType.Perspective) {
      (this._handler as THREE.PerspectiveCamera).aspect = this._aspect;
      (this._handler as THREE.OrthographicCamera).updateProjectionMatrix();
    }
  }

  public override onAttached(): void {
    addEventListener('resize', (e) => this.onResize(e));
    addThreeJsObjectToScene(this.uuid, this._handler, this.entity.uuid);
  }
  public override onDetached(): void {
    removeEventListener('resize', (e) => this.onResize(e));
    removeThreeJsObjectFromScene(this.uuid);
  }
}