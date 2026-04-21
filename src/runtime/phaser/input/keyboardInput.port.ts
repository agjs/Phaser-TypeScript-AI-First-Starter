import type { MoveIntent } from '@domain/player';
import * as Phaser from 'phaser';

export interface IInputPort {
  currentIntent: () => MoveIntent;
  destroy: () => void;
}

export const createKeyboardInputPort = (scene: Phaser.Scene): IInputPort => {
  const keyboard = scene.input.keyboard;

  if (!keyboard) {
    return {
      currentIntent: () => ({ dx: 0, dy: 0 }),
      destroy: () => undefined,
    };
  }

  const cursors = keyboard.createCursorKeys();
  const wasd = keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  }) as Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;

  return {
    currentIntent() {
      let dx = 0;
      let dy = 0;

      if (cursors.left?.isDown || wasd.left.isDown) {
        dx -= 1;
      }

      if (cursors.right?.isDown || wasd.right.isDown) {
        dx += 1;
      }

      if (cursors.up?.isDown || wasd.up.isDown) {
        dy -= 1;
      }

      if (cursors.down?.isDown || wasd.down.isDown) {
        dy += 1;
      }

      return { dx, dy };
    },
    destroy() {
      keyboard.removeKey('W');
      keyboard.removeKey('A');
      keyboard.removeKey('S');
      keyboard.removeKey('D');
    },
  };
};
