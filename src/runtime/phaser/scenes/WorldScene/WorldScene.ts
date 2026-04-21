import * as Phaser from 'phaser';

import { WORLD_SCENE_KEY } from './WorldScene.constants.js';
import { setupWorldScene, type IWorldSceneRuntime } from './WorldScene.setup.js';
import { createLocalStorageSavePort } from '../../../adapters/localStorageSave.port.js';
import { createPhaserHudRenderer } from '../../rendering/hudRenderer.js';

export class WorldScene extends Phaser.Scene {
  private runtime: IWorldSceneRuntime | null = null;

  constructor() {
    super(WORLD_SCENE_KEY);
  }

  async create(): Promise<void> {
    const hud = createPhaserHudRenderer(this);
    const save = createLocalStorageSavePort();
    this.runtime = await setupWorldScene({
      scene: this,
      deps: { hud, save },
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.runtime?.dispose();
      this.runtime = null;
    });
  }

  override update(_time: number, delta: number): void {
    this.runtime?.update(delta);
  }
}
