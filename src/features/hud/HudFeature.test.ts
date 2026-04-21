import type { GameEventMap } from '@domain/core';
import { createEventBus } from '@shared/events';
import { describe, expect, it, vi } from 'vitest';

import type { IHudRenderer } from './Hud.contracts.js';
import { createHudFeature } from './HudFeature.js';

const fakeRenderer = (): IHudRenderer & { readonly scores: number[] } => {
  const scores: number[] = [];
  return {
    setScore(s) {
      scores.push(s);
    },
    get scores() {
      return scores;
    },
  };
};

describe('HudFeature', () => {
  it('initializes the HUD to 0', () => {
    const events = createEventBus<GameEventMap>();
    const renderer = fakeRenderer();
    createHudFeature({ events, renderer });
    expect(renderer.scores).toEqual([0]);
  });

  it('updates the HUD on progression.updated', () => {
    const events = createEventBus<GameEventMap>();
    const renderer = fakeRenderer();
    createHudFeature({ events, renderer });
    events.emit('progression.updated', { score: 5 });
    events.emit('progression.updated', { score: 7 });
    expect(renderer.scores).toEqual([0, 5, 7]);
  });

  it('dispose unsubscribes', () => {
    const events = createEventBus<GameEventMap>();
    const renderer = fakeRenderer();
    const feature = createHudFeature({ events, renderer });
    feature.dispose();
    events.emit('progression.updated', { score: 99 });
    expect(renderer.scores).toEqual([0]);
  });

  it('updates the HUD on saveGame.loaded', () => {
    const events = createEventBus<GameEventMap>();
    const renderer = fakeRenderer();
    createHudFeature({ events, renderer });
    events.emit('saveGame.loaded', { score: 42 });
    expect(renderer.scores).toContain(42);
    // also verify spy is unused
    expect(vi.isMockFunction(renderer.setScore)).toBe(false);
  });
});
