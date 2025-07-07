import { Core } from "@/engine/core";
import { RapierSceneManager } from "./scene.manager";

export class PhysicsSystem extends Core.System {
  constructor() {
    super();
    Core.engine.addEventListener(Core.EngineEventType.SceneChanged, () => {
      Core.engine.scene.addThirdPartySceneManager(
        Core.SupportedThirdPartySceneManager.RapierJs,
        new RapierSceneManager()
      );
    });
    Core.engine.scene.addThirdPartySceneManager(
      Core.SupportedThirdPartySceneManager.RapierJs,
      new RapierSceneManager()
    );
  }

  override onPhysics(): void {
    const sceneManager = Core.engine.scene.getThirdPartySceneManager(
      Core.SupportedThirdPartySceneManager.RapierJs
    ) as RapierSceneManager;
    for (const uuid of sceneManager.bodies.keys()) {
      const entity = Core.engine.scene.entitiesByUuid.get(uuid);
      const body = sceneManager.bodies.get(uuid);
      if (!entity || !body) continue;
      const translation = body.translation();
      entity.transform.position = new Core.Vector3(
        translation.x,
        translation.y,
        translation.z
      );
      const rotation = body.rotation();
      entity.transform.rotation = new Core.Quaternion(
        rotation.x,
        rotation.y,
        rotation.z,
        rotation.w
      );
    }
  }
}