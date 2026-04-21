import type { IAudioPort } from '@shared/types';
import type * as Phaser from 'phaser';

export const createPhaserAudioPort = (scene: Phaser.Scene): IAudioPort => ({
  play(soundId) {
    if (scene.sound.get(soundId)) {
      scene.sound.play(soundId);
    }
  },
});
