import type { IHudRenderer } from '@features/hud';
import type * as Phaser from 'phaser';

export const createPhaserHudRenderer = (scene: Phaser.Scene): IHudRenderer => {
  const label = scene.add
    .text(16, 16, 'Score: 0', {
      color: '#ffffff',
      fontFamily: 'monospace',
      fontSize: '20px',
    })
    .setScrollFactor(0)
    .setDepth(1000);

  return {
    setScore(score) {
      label.setText(`Score: ${score}`);
    },
  };
};
