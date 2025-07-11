import * as THREE from 'three';
import { Core } from '@/engine';
import { CameraModule } from './camera.module';
import { GraphicsLoader } from './graphics.parser';

export class RenderSystem extends Core.System {
  private readonly _loader = new GraphicsLoader();
  private readonly _handler = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  private _world = new THREE.Scene();
  private _entityMapping = new Map<string, THREE.Object3D>();
  private _cameras = new Map<string, THREE.Camera>();
  private _dirtyEntities = new Set<InstanceType<typeof Core.Entity>>();
  private _performance = 0;
  private _fps = 0;

  get fps(): number {
    return this._fps;
  }

  get handler(): THREE.WebGLRenderer {
    return this._handler;
  }
  get size(): InstanceType<typeof Core.Vector2> {
    const size = this._handler.getSize(new THREE.Vector2());
    return new Core.Vector2(size.width, size.height);
  }
  set size(value: InstanceType<typeof Core.Vector2>) {
    this._handler.setSize(value.x, value.y);
  }

  async onAttached(): Promise<void> {
    // handle auto resizing
    this._handler.setSize(innerWidth, innerHeight);
    addEventListener('resize', (e) => this.onResize(e));

    // setup DOM canvas
    this._handler.domElement.id = "canvas";
    document.body.appendChild(this._handler.domElement);

    // renderer properties
    this._handler.outputColorSpace = THREE.SRGBColorSpace;
    this._handler.toneMapping = THREE.ACESFilmicToneMapping;
    this._handler.toneMappingExposure = 1.0;
    this._handler.shadowMap.enabled = true;

    // handle engine events
    Core.engine.events.addEventListener(
      Core.EventType.EntityAdded,
      (entity: InstanceType<typeof Core.Entity>) => this.onEntityAdded(entity)
    );
    Core.engine.events.addEventListener(
      Core.EventType.EntityRemoved,
      (entity: InstanceType<typeof Core.Entity>) => this.onEntityRemoved(entity)
    );
    Core.engine.events.addEventListener(
      Core.EventType.ModuleAdded,
      (module: InstanceType<typeof Core.Module>) => this.onModuleAdded(module)
    );
    Core.engine.events.addEventListener(
      Core.EventType.ModuleRemoved,
      (module: InstanceType<typeof Core.Module>) => this.onModuleRemoved(module)
    );
    Core.engine.events.addEventListener(
      Core.EventType.EntityTransformChanged,
      (entity: InstanceType<typeof Core.Entity>) => this.onEntityTransformChanged(entity)
    );
    this._loader.addEvents();

    this._handler.setAnimationLoop(() => Core.engine.onRender());
    this._world.background = new THREE.Color('#24273A');
  }
  override async onDetached(): Promise<void> {
    removeEventListener('resize', (e) => this.onResize(e));
    Core.engine.events.removeEventListener(
      Core.EventType.EntityAdded,
      (entity: InstanceType<typeof Core.Entity>) => this.onEntityAdded(entity)
    );
    Core.engine.events.removeEventListener(
      Core.EventType.EntityRemoved,
      (entity: InstanceType<typeof Core.Entity>) => this.onEntityRemoved(entity)
    );
    Core.engine.events.removeEventListener(
      Core.EventType.ModuleAdded,
      (module: InstanceType<typeof Core.Module>) => this.onModuleAdded(module)
    );
    Core.engine.events.removeEventListener(
      Core.EventType.ModuleRemoved,
      (module: InstanceType<typeof Core.Module>) => this.onModuleRemoved(module)
    );
    Core.engine.events.removeEventListener(
      Core.EventType.EntityTransformChanged,
      (entity: InstanceType<typeof Core.Entity>) => this.onEntityTransformChanged(entity)
    );

    this._loader.removeEvents();
    this._handler.dispose();
    this._world.clear();
    this._cameras.clear();
    this._entityMapping.clear();
    this._dirtyEntities.clear();
    this._performance = 0;
    this._fps = 0;
  }
  private onEntityAdded(entity: InstanceType<typeof Core.Entity>) {
    const obj = new THREE.Object3D();
    obj.uuid = entity.uuid;
    if (entity.parent) {
      const parentObj = this._entityMapping.get(entity.parent.uuid);
      if (!parentObj) {
        console.warn('failed to add entity: parent not found');
        return;
      }
      obj.parent = parentObj;
      parentObj.add(obj);
    } else {
      this._world.add(obj);
    }
    this._entityMapping.set(entity.uuid, obj);
  }
  private onEntityRemoved(entity: InstanceType<typeof Core.Entity>) {
    const obj = this._entityMapping.get(entity.uuid);
    if (!obj) return;
    this._world.remove(obj);
    this._entityMapping.delete(entity.uuid);
  }
  private onModuleAdded(module: InstanceType<typeof Core.Module>) {
    const type = module.getModuleType();
    const obj = this._entityMapping.get(module.entity.uuid);
    if (!obj) return;
    switch (type) {
      case 'camera':
        this._cameras.set(module.uuid, (module as CameraModule)['_handler']);
      case 'renderer':
      case 'light':
      case 'speaker':
        const mesh = module as any;
        const handler = mesh['_handler'];
        obj.add(handler);
        break;
    }
  }
  private onModuleRemoved(module: InstanceType<typeof Core.Module>) {
    const type = module.getModuleType();
    const obj = this._entityMapping.get(module.entity.uuid);
    if (!obj) return;
    switch (type) {
      case 'camera':
        this._cameras.delete(module.uuid);
      case 'mesh':
      case 'light':
        const mesh = module as any;
        const handler = mesh['_handler'];
        obj.remove(handler);
        break;
    }
  }
  private onEntityTransformChanged(entity: InstanceType<typeof Core.Entity>) {
    this._dirtyEntities.add(entity);
  }
  private onResize(_e: UIEvent) {
    this._handler.setSize(innerWidth, innerHeight);
  }
  private updateTransform(obj: THREE.Object3D, entity: InstanceType<typeof Core.Entity>) {
    // directional light handles updates by itself
    if (obj instanceof THREE.DirectionalLight) return;
    obj.position.set(
      entity.transform.position.x,
      entity.transform.position.y,
      entity.transform.position.z
    );
    obj.rotation.setFromQuaternion(
      new THREE.Quaternion(
        entity.transform.rotation.x,
        entity.transform.rotation.y,
        entity.transform.rotation.z,
        entity.transform.rotation.w
      )
    );
    obj.scale.set(
      entity.transform.scale.x,
      entity.transform.scale.y,
      entity.transform.scale.z
    );
  }

  override onRender() {
    for (const entity of this._dirtyEntities) {
      const obj = this._entityMapping.get(entity.uuid);
      if (!obj) continue;
      this.updateTransform(obj, entity);
    }
    this._dirtyEntities.clear();
    for (const camera of this._cameras.values()) {
      this._handler.render(this._world, camera);
    }
    const now = performance.now();
    this._fps = 1000 / (now - this._performance);
    this._performance = now;
  }
}