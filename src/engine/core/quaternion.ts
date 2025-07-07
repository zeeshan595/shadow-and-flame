import * as THREE from 'three';

export class Quaternion {
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;
  public w: number = 1; // Default to identity quaternion

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static fromEulerAngles(x: number, y: number, z: number) {
    x = x * Math.PI / 180;
    y = y * Math.PI / 180;
    z = z * Math.PI / 180;
    return Quaternion.fromEuler(x, y, z);
  }

  static fromEuler(x: number, y: number, z: number) {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(
      x, y, z
    ));
    return new Quaternion(
      q.x,
      q.y,
      q.z,
      q.w
    );
  }

  multiply(other: Quaternion) {
    const q1 = new THREE.Quaternion(this.x, this.y, this.z, this.w);
    const q2 = q1.multiply(new THREE.Quaternion(other.x, other.y, other.z, other.w));
    return new Quaternion(
      q2.x,
      q2.y,
      q2.z,
      q2.w
    );
  }
}