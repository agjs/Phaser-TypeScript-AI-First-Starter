import type { IRandomPort } from '@shared/types';

/**
 * Seedable xorshift32 PRNG. Deterministic for a given seed — useful later for
 * replays and network lockstep sync.
 */
export const createBrowserRandomPort = (seed: number = Date.now()): IRandomPort => {
  let state = seed | 0 || 1;

  const next = (): number => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;

    return (state >>> 0) / 0xffffffff;
  };

  return {
    nextFloat: next,
    nextInt: (minInclusive, maxExclusive) =>
      minInclusive + Math.floor(next() * (maxExclusive - minInclusive)),
  };
};
