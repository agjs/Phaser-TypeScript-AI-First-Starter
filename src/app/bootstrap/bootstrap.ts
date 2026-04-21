import * as Phaser from 'phaser';

import { createGameConfig } from '../config/gameConfig.js';

export const bootstrapGame = (parent: string | HTMLElement): Phaser.Game =>
  new Phaser.Game(createGameConfig(parent));
