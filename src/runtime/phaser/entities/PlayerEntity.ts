import type { PlayerState } from '@domain/player';
import type * as Phaser from 'phaser';

export interface IPlayerEntity {
  readonly sprite: Phaser.GameObjects.Rectangle;
  render: (state: PlayerState) => void;
  destroy: () => void;
}

export const createPlayerEntity = (scene: Phaser.Scene, initial: PlayerState): IPlayerEntity => {
  const sprite = scene.add
    .rectangle(initial.position.x, initial.position.y, 24, 24, 0x4caf50)
    .setStrokeStyle(2, 0xffffff);

  return {
    sprite,
    render(state) {
      sprite.setPosition(state.position.x, state.position.y);
    },
    destroy() {
      sprite.destroy();
    },
  };
};
