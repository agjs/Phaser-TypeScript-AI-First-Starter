import type { ITimePort } from '../types/ports.js';

export interface IFakeTimePort extends ITimePort {
  advance: (ms: number) => void;
  set: (ms: number) => void;
}

export const createFakeTimePort = (initialMs = 0): IFakeTimePort => {
  let current = initialMs;
  return {
    now: () => current,
    advance: (ms) => {
      current += ms;
    },
    set: (ms) => {
      current = ms;
    },
  };
};
