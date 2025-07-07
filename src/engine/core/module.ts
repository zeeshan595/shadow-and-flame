import type { Entity } from "./entity";

export class Module {
  public readonly uuid: string = crypto.randomUUID();
  private readonly _type: string = '';
  private _entity: Entity;

  constructor(type: string) {
    this._type = type;
    this._entity = {} as any;
  }

  public getModuleType(): string {
    return this._type;
  }

  public get entity(): Entity {
    return this._entity;
  }

  /**
   * runs when module is added to an entity
   */
  public onAttached() { }

  /**
   * runs when module is removed from an entity
   */
  public onDetached() { }

  /**
   * runs when scene is started
   */
  public onStart() { }

  /**
   * runs on a fixed time for physics processing
   */
  public onPhysics() { }

  /**
   * runs every frame
   */
  public onRender() { }

  /**
  * runs when a scene is stopped
  */
  public onStop() { }
}