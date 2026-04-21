import type * as Phaser from 'phaser';

export const ARCADE_GRAVITY_Y = 0;

export const configureArcadeWorld = (scene: Phaser.Scene, width: number, height: number): void => {
  scene.physics.world.setBounds(0, 0, width, height);
};
