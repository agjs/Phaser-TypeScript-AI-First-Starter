import { createGameState, type GameEventMap } from '@domain/core';
import { createEventBus } from '@shared/events';
import { describe, expect, it, vi } from 'vitest';

import { createMovementFeature } from './MovementFeature.js';

describe('MovementFeature.tick', () => {
  const bounds = { min: { x: 0, y: 0 }, max: { x: 960, y: 540 } };

  it('advances the player and emits player.moved', () => {
    const events = createEventBus<GameEventMap>();
    const spy = vi.fn();
    events.on('player.moved', spy);

    const feature = createMovementFeature({ events, bounds });
    const state = createGameState();
    const next = feature.tick(state, { dx: 1, dy: 0 }, 100);

    expect(next.player.position.x).toBeGreaterThan(state.player.position.x);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('does not emit when the player does not move', () => {
    const events = createEventBus<GameEventMap>();
    const spy = vi.fn();
    events.on('player.moved', spy);

    const feature = createMovementFeature({ events, bounds });
    feature.tick(createGameState(), { dx: 0, dy: 0 }, 100);

    expect(spy).not.toHaveBeenCalled();
  });

  it('clamps the player to world bounds', () => {
    const events = createEventBus<GameEventMap>();
    const feature = createMovementFeature({ events, bounds });
    const state = createGameState();
    // push far left for a long time
    let s = state;
    for (let i = 0; i < 50; i += 1) {
      s = feature.tick(s, { dx: -1, dy: 0 }, 100);
    }
    expect(s.player.position.x).toBe(bounds.min.x);
  });
});
