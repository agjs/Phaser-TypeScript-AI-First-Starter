import * as Phaser from 'phaser';

import { BootScene } from '../../runtime/phaser/scenes/BootScene/index.js';
import {
  WorldScene,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from '../../runtime/phaser/scenes/WorldScene/index.js';

export const createGameConfig = (parent: string | HTMLElement): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
  backgroundColor: '#1e1e28',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
  scene: [BootScene, WorldScene],
});
