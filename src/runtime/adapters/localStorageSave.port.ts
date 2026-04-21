import type { ISaveGamePort } from '@shared/types';

export const createLocalStorageSavePort = (): ISaveGamePort => ({
  save(key, payload) {
    window.localStorage.setItem(key, payload);
    return Promise.resolve();
  },
  load(key) {
    return Promise.resolve(window.localStorage.getItem(key));
  },
});
