import type { InteractableState } from '@domain/interaction';
import type * as Phaser from 'phaser';

export interface IInteractableEntity {
  readonly sprite: Phaser.GameObjects.Arc;
  render: (state: InteractableState) => void;
  destroy: () => void;
}

export const createInteractableEntity = (
  scene: Phaser.Scene,
  initial: InteractableState,
): IInteractableEntity => {
  const sprite = scene.add
    .circle(initial.position.x, initial.position.y, initial.radius, 0xffc107)
    .setStrokeStyle(2, 0xffffff);

  return {
    sprite,
    render(state) {
      sprite.setVisible(!state.consumed);
    },
    destroy() {
      sprite.destroy();
    },
  };
};
