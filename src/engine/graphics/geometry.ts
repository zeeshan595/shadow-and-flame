import * as THREE from 'three';

export enum GeometryType {
  BoxGeometry = 'BoxGeometry',
  SphereGeometry = 'SphereGeometry',
  PlaneGeometry = 'PlaneGeometry',
  CylinderGeometry = 'CylinderGeometry',
  ConeGeometry = 'ConeGeometry',
  RingGeometry = 'RingGeometry',
  EdgesGeometry = 'EdgesGeometry',
  WireframeGeometry = 'WireframeGeometry',
  Custom = "Custom"
}

export class Geometry {
  private _handler: THREE.BufferGeometry;

  constructor(public readonly type?: GeometryType) {
    if (!type) {
      type = GeometryType.BoxGeometry;
    }
    switch (type) {
      default:
      case GeometryType.BoxGeometry:
        this._handler = new THREE.BoxGeometry();
        break;
      case GeometryType.SphereGeometry:
        this._handler = new THREE.SphereGeometry();
        break;
      case GeometryType.PlaneGeometry:
        this._handler = new THREE.PlaneGeometry();
        break;
      case GeometryType.CylinderGeometry:
        this._handler = new THREE.CylinderGeometry();
        break;
      case GeometryType.ConeGeometry:
        this._handler = new THREE.ConeGeometry();
        break;
      case GeometryType.RingGeometry:
        this._handler = new THREE.RingGeometry();
        break;
      case GeometryType.EdgesGeometry:
        this._handler = new THREE.EdgesGeometry();
        break;
      case GeometryType.WireframeGeometry:
        this._handler = new THREE.WireframeGeometry();
        break;
      case GeometryType.Custom:
        this._handler = new THREE.BufferGeometry();
        break;
    }
  }

  get handler(): THREE.BufferGeometry {
    return this._handler;
  }

  //todo: add setters for custom mesh
  setIndexes() { };
  setvertices() { };
  setNormals() { };
  setColors() { };
}