import type { GameEventMap, GameState } from '@domain/core';
import type { IEventBus } from '@shared/events';
import type { ISaveGamePort } from '@shared/types';

import type { ISaveGamePayload } from './SaveGame.contracts.js';

const SAVE_KEY = 'phaser-ts-starter:save';

export interface ISaveGameFeatureDeps {
  readonly events: IEventBus<GameEventMap>;
  readonly port: ISaveGamePort;
  readonly getState: () => GameState;
}

export interface ISaveGameFeature {
  dispose: () => void;
  load: () => Promise<ISaveGamePayload | null>;
}

export const createSaveGameFeature = (deps: ISaveGameFeatureDeps): ISaveGameFeature => {
  const unsub = deps.events.on('saveGame.requested', () => {
    const state = deps.getState();
    const payload: ISaveGamePayload = {
      version: 1,
      score: state.progression.score,
      consumedIds: Array.from(state.progression.consumedIds),
    };

    void deps.port
      .save(SAVE_KEY, JSON.stringify(payload))
      .then(() => {
        deps.events.emit('saveGame.completed', { ok: true });
      })
      .catch(() => {
        deps.events.emit('saveGame.completed', { ok: false });
      });
  });

  return {
    dispose: unsub,
    async load() {
      const raw = await deps.port.load(SAVE_KEY);
      if (!raw) {
        return null;
      }

      try {
        const parsed = JSON.parse(raw) as ISaveGamePayload;
        deps.events.emit('saveGame.loaded', { score: parsed.score });

        return parsed;
      } catch {
        return null;
      }
    },
  };
};
