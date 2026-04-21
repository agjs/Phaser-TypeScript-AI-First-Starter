import * as Phaser from 'phaser';

import { BOOT_SCENE_KEY } from './BootScene.constants.js';
import { WORLD_SCENE_KEY } from '../WorldScene/WorldScene.constants.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super(BOOT_SCENE_KEY);
  }

  preload(): void {
    // Place asset registration here (scene.load.image / .audio / .spritesheet).
    // Keep logic out of this method — it is the imperative shell for load only.
  }

  create(): void {
    this.scene.start(WORLD_SCENE_KEY);
  }
}
