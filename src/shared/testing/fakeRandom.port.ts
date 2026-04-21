import type { IRandomPort } from '../types/ports.js';

/**
 * Deterministic PRNG for tests. xorshift32, seeded.
 * Same seed → same sequence across runs and platforms.
 */
export const createFakeRandomPort = (seed = 1): IRandomPort => {
  let state = seed | 0 || 1;

  const next = (): number => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;

    return (state >>> 0) / 0xffffffff;
  };

  return {
    nextFloat: next,
    nextInt: (minInclusive, maxExclusive) => {
      const span = maxExclusive - minInclusive;

      return minInclusive + Math.floor(next() * span);
    },
  };
};

export const createScriptedRandomPort = (sequence: readonly number[]): IRandomPort => {
  let i = 0;
  const nextFloat = (): number => {
    const v = sequence[i % sequence.length];
    i += 1;

    return v ?? 0;
  };

  return {
    nextFloat,
    nextInt: (minInclusive, maxExclusive) =>
      minInclusive + Math.floor(nextFloat() * (maxExclusive - minInclusive)),
  };
};
