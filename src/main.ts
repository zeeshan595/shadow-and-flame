import { Core, Graphics, Audio, Physics } from "@/engine";
import './styles.css';
import './font.css';

await Core.engine.addSystem(new Graphics.RendererSystem());
await Core.engine.addSystem(new Physics.PhysicsSystem());

const scene = new Core.Scene();

// create camera and lighting
{
  // camera
  const camera = scene.addEntity(new Core.Entity("camera"));
  camera.transform.position = new Core.Vector3(0, 6, 5);
  camera.transform.rotation = Core.Quaternion.fromEulerAngles(-60, 0, 0);
  const cameraModule = camera.addModule(new Graphics.CameraModule());

  // ambient light
  const ambientLight = scene.addEntity(new Core.Entity("ambientLight"));
  const ambientLightModule = ambientLight.addModule(
    new Graphics.LightModule(Graphics.LightType.Ambient)
  );
  ambientLightModule.intensity = 0.1;

  // directional light
  const directionalLight = scene.addEntity(new Core.Entity("directionalLight"));
  const directionalLightModule = directionalLight.addModule(
    new Graphics.LightModule(Graphics.LightType.Directional)
  );
  directionalLightModule.directionalLightVector = new Core.Vector3(1, -2, 1);
}

// create tiles for the board
for (let y = -3; y <= 3; y++) {
  for (let x = -5; x <= 5; x++) {
    const tile = scene.addEntity(new Core.Entity(`tile-${(x + 5)}x${(y + 3)}`));
    tile.transform.position = new Core.Vector3(
      x + (x * 0.1),
      0,
      y + (y * 0.1)
    );
    tile.transform.rotation = Core.Quaternion.fromEulerAngles(
      -90, 0, 0
    );
    // render
    const mesh = tile.addModule(new Graphics.MeshModule());
    mesh.setGeometry(new Graphics.Geometry(Graphics.GeometryType.PlaneGeometry));
    const material = new Graphics.Material(Graphics.MaterialType.MeshPhongMaterial);
    material.enableAlphaBlending = true;
    material.opacity = 0.3;
    mesh.setMaterial(material);

    // physics
    tile.addModule(new Physics.ColliderModule({
      type: Physics.ColliderType.Box,
      halfExtents: new Core.Vector3(0.5, 0.05, 0.5)
    }));
  }
}

// create player
{
  const palyer = scene.addEntity(new Core.Entity("player"));
  palyer.transform.position = new Core.Vector3(2.1, 0.5, 2.3);
  palyer.transform.rotation = Core.Quaternion.fromEulerAngles(
    -90, 0, 0
  );
  palyer.transform.scale = new Core.Vector3(0.6, 0.6, 0.6);
  const mesh = palyer.addModule(new Graphics.MeshModule());
  mesh.setGeometry(new Graphics.Geometry(Graphics.GeometryType.BoxGeometry));
  const material = new Graphics.Material(Graphics.MaterialType.MeshPhongMaterial);
  material.color = new Core.Color(0.5, 0.5, 0.5);
  mesh.setMaterial(material);
}

Core.engine.scene = scene;