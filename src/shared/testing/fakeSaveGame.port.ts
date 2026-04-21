import type { ISaveGamePort } from '../types/ports.js';

export const createFakeSaveGamePort = (): ISaveGamePort => {
  const store = new Map<string, string>();
  return {
    save: (key, payload) => {
      store.set(key, payload);
      return Promise.resolve();
    },
    load: (key) => Promise.resolve(store.get(key) ?? null),
  };
};
