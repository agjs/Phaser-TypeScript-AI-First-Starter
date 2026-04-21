import type { ProgressionState } from './Progression.types.js';

export const createProgression = (): ProgressionState => ({
  score: 0,
  consumedIds: new Set<string>(),
});
