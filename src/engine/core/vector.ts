import * as THREE from 'three';

export class Vector2 {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  static zero = new Vector2(0, 0);

  add(other: Vector2) {
    return new Vector2(
      this.x + other.x,
      this.y + other.y,
    );
  }

  subtract(other: Vector2) {
    return new Vector2(
      this.x - other.x,
      this.y - other.y,
    )
  }

  multiply(val: number) {
    return new Vector2(
      this.x * val,
      this.y * val,
    )
  }

  divide(val: number) {
    return new Vector2(
      this.x / val,
      this.y / val,
    )
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const length = this.length();
    return new Vector2(
      this.x / length,
      this.y / length,
    );
  }

  isEqual(other: Vector2) {
    return this.x === other.x && this.y === other.y;
  }
}

export class Vector3 {
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static one() {
    return new Vector3(1, 1, 1);
  }

  add(other: Vector3) {
    return new Vector3(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z
    );
  }

  subtract(other: Vector3) {
    return new Vector3(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z
    )
  }

  multiply(val: number) {
    return new Vector3(
      this.x * val,
      this.y * val,
      this.z * val
    )
  }

  divide(val: number) {
    return new Vector3(
      this.x / val,
      this.y / val,
      this.z / val
    )
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const length = this.length();
    return new Vector3(
      this.x / length,
      this.y / length,
      this.z / length
    );
  }
}

export class Vector4 {
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;
  public w: number = 0;

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}