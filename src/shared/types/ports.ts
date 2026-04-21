/**
 * Cross-cutting runtime ports. Domain and features depend on these interfaces;
 * runtime/** supplies the concrete implementations.
 *
 * Do not add engine- or transport-specific types here. Those live in runtime/.
 */

export interface ITimePort {
  now: () => number;
}

export interface IRandomPort {
  nextFloat: () => number;
  nextInt: (minInclusive: number, maxExclusive: number) => number;
}

export interface IAudioPort {
  play: (soundId: string) => void;
}

export interface ISaveGamePort {
  save: (key: string, payload: string) => Promise<void>;
  load: (key: string) => Promise<string | null>;
}
