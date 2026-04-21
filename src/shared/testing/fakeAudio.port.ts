import type { IAudioPort } from '../types/ports.js';

export interface IFakeAudioPort extends IAudioPort {
  readonly plays: readonly string[];
  reset: () => void;
}

export const createFakeAudioPort = (): IFakeAudioPort => {
  const plays: string[] = [];
  return {
    play: (soundId) => {
      plays.push(soundId);
    },
    get plays() {
      return plays;
    },
    reset: () => {
      plays.length = 0;
    },
  };
};
