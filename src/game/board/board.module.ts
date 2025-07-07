import { Entity, Module, Vector2, Vector3, Quaternion } from "@/engine/core";
import { Geometry, GeometryType, Material, MaterialType, MeshModule, Texture } from "@/engine/render";

export class BoardModule extends Module {
  private _board: Entity[] = [];
  private _material: Material;

  constructor() {
    super('board');
    this._material = new Material(MaterialType.MeshBasicMaterial);
    this._material.setTexture(new Texture(
      '/assets/cell.webp'
    ))
  }

  override onStart(): void {
    if (!this.entity) {
      console.warn('failed to start board module: entity not found')
      return;
    }
    this.entity.transform.position = new Vector3(0, 0, 0);
    this.entity.transform.rotation = Quaternion.fromEulerAngles(-20, 0, 0)
    const cellSize = 1;
    const size = new Vector2(8, 5);
    const offset = new Vector2(3, 1);
    for (let i = 0; i < size.y; i++) {
      for (let j = 0; j < size.x; j++) {
        const cell = new Entity();
        const x = j * cellSize - offset.x;
        const y = i * cellSize - offset.y;
        cell.transform.position = new Vector3(x, y, 0);
        cell.transform.scale = new Vector3(cellSize, cellSize, cellSize);
        cell.name = 'cell';
        const mesh = new MeshModule();
        mesh.setMaterial(this._material);
        mesh.setGeometry(new Geometry(GeometryType.PlaneGeometry));
        cell.addModule(mesh);
        this._board.push(cell);
        this.entity.addChild(cell);
      }
    }
  }
}