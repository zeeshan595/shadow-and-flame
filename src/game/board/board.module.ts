import { Core } from "@/engine";
import { Graphics } from "@/engine/graphics";

export class BoardModule extends Core.Module {
  private _board: InstanceType<typeof Core.Entity>[] = [];
  private _material = new Graphics.Material();

  constructor() {
    super('board');
    this._material = new Graphics.Material(Graphics.MaterialType.MeshBasicMaterial);
    this._material.color = new Core.Color(1, 1, 1);
    this._material.opacity = 0.25;
    this._material.enableAlphaBlending = true;
  }

  override onStart(): void {
    if (!this.entity) {
      console.warn('failed to start board module: entity not found')
      return;
    }
    this.entity.transform.position = new Core.Vector3(-4.5, -3, 2);
    this.entity.transform.rotation = Core.Quaternion.fromEulerAngles(-90, 0, 0)
    const cellSize = 1;
    const size = new Core.Vector2(10, 6);
    const offset = new Core.Vector2(0.05, 0.05);
    for (let i = 0; i < size.y; i++) {
      for (let j = 0; j < size.x; j++) {
        const cell = this.entity._addChild(new Core.Entity());
        const x = (j * cellSize) + (offset.x * j);
        const y = (i * cellSize) + (offset.y * i);
        cell.transform.position = new Core.Vector3(x, y, 0);
        cell.transform.scale = new Core.Vector3(cellSize, cellSize, cellSize);
        cell.name = 'cell';
        const mesh = cell.addModule(new Graphics.MeshModule());
        mesh.setMaterial(this._material);
        mesh.setGeometry(new Graphics.Geometry(Graphics.GeometryType.PlaneGeometry));
        this._board.push(cell);
      }
    }
  }
}