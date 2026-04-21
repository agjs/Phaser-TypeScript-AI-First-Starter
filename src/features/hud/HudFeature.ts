import type { GameEventMap } from '@domain/core';
import type { IEventBus } from '@shared/events';

import type { IHudRenderer } from './Hud.contracts.js';

export interface IHudFeatureDeps {
  readonly events: IEventBus<GameEventMap>;
  readonly renderer: IHudRenderer;
}

export interface IHudFeature {
  dispose: () => void;
}

export const createHudFeature = (deps: IHudFeatureDeps): IHudFeature => {
  const unsubProgress = deps.events.on('progression.updated', ({ score }) => {
    deps.renderer.setScore(score);
  });

  const unsubLoaded = deps.events.on('saveGame.loaded', ({ score }) => {
    deps.renderer.setScore(score);
  });

  deps.renderer.setScore(0);

  return {
    dispose() {
      unsubProgress();
      unsubLoaded();
    },
  };
};
