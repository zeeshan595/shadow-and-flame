import { addThreeJsObjectToScene, removeThreeJsObjectFromScene } from "../graphics/scene.manager";
import { Core } from "@/engine/core";
import { _static_listener } from "./listener.module";
import * as THREE from "three";

export enum SpeakerType {
  TwoDimensional = "2d",
  ThreeDimensional = "3d",
}

export class SpeakerModule extends Core.Module {
  private _object: THREE.Object3D;
  private _speaker: THREE.Audio | THREE.PositionalAudio;
  private _speakerType: SpeakerType;
  private _volume: number;
  private _loop: boolean;
  private _autoplay: boolean;

  constructor() {
    super('speaker');
    this._object = new THREE.Object3D();
    this._speaker = new THREE.Audio(_static_listener) as THREE.Audio;
    this._speaker.hasPlaybackControl = true;
    this._speakerType = SpeakerType.TwoDimensional;
    this._object.add(this._speaker);
    this._volume = 1;
    this._loop = false;
    this._autoplay = false;
  }

  private autoplayHandler() {
    if (!this._autoplay) return;
    if (Core.engine.hasUserInteractedWithWindow) {
      if (!this._speaker.isPlaying)
        this._speaker.play();
    }
    setTimeout(() => this.autoplayHandler(), 100);
  }
  get type(): SpeakerType {
    return this._speakerType;
  }
  set type(value: SpeakerType) {
    if (!Object.values(SpeakerType).includes(value)) {
      throw new Error(`Invalid speaker type: ${value}`);
    }
    this._speakerType = value;
    switch (this._speakerType) {
      case SpeakerType.TwoDimensional:
        this._speaker = new THREE.Audio(_static_listener) as THREE.Audio;
        break;
      case SpeakerType.ThreeDimensional:
        this._speaker = new THREE.PositionalAudio(_static_listener) as THREE.PositionalAudio;
        break;
    }
    this.volume = this._volume;
    this.loop = this._loop;
  }
  get volume(): number {
    return this._volume;
  }
  set volume(value: number) {
    if (value < 0 || value > 1) {
      throw new Error(`Invalid volume: ${value}. Must be between 0 and 1.`);
    }
    this._volume = value;
    this._speaker.setVolume(value);
  }
  get loop(): boolean {
    return this._loop;
  }
  set loop(value: boolean) {
    this._loop = value;
    this._speaker.setLoop(value);
  }
  get autoplay(): boolean {
    return this._autoplay;
  }
  set autoplay(value: boolean) {
    this._autoplay = value;
    this.autoplayHandler();
  }
  play(queueIfUserHasNotInteracted = true) {
    if (Core.engine.hasUserInteractedWithWindow) {
      this._speaker.play();
    } else if (queueIfUserHasNotInteracted) {
      setTimeout(() => this.play(true), 100);
    }
  }
  setBuffer(buffer: AudioBuffer) {
    this._speaker.setBuffer(buffer);
  }
  loadFromPath(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const loader = new THREE.AudioLoader();
      loader.load(
        path,
        (buffer) => {
          this.setBuffer(buffer);
          resolve();
        },
        (event) => console.info(`loaded audio: ${event.total}`),
        (err) => {
          console.error(`failed to load audio: ${err}`);
          reject(err);
        }
      );
    });
  }

  public onStart(): void {
    addThreeJsObjectToScene(this.uuid, this._speaker, this.entity.uuid);
  }
  public onStop(): void {
    removeThreeJsObjectFromScene(this.uuid);
  }
}