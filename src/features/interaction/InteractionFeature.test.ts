import { createGameState, type GameEventMap } from '@domain/core';
import { createEventBus } from '@shared/events';
import { describe, expect, it, vi } from 'vitest';

import { createInteractionFeature } from './InteractionFeature.js';

describe('InteractionFeature.tick', () => {
  it('consumes overlapping interactables and updates progression', () => {
    const events = createEventBus<GameEventMap>();
    const interactionSpy = vi.fn();
    const progressionSpy = vi.fn();
    events.on('interaction.completed', interactionSpy);
    events.on('progression.updated', progressionSpy);

    const feature = createInteractionFeature({ events });
    const state = createGameState();

    const overlapping = {
      ...state,
      player: { ...state.player, position: state.interactables[0]!.position },
    };
    const next = feature.tick(overlapping);

    expect(interactionSpy).toHaveBeenCalledOnce();
    expect(progressionSpy).toHaveBeenCalledWith({ score: 1 });
    expect(next.interactables[0]!.consumed).toBe(true);
    expect(next.progression.score).toBe(1);
  });

  it('is a no-op when no overlaps', () => {
    const events = createEventBus<GameEventMap>();
    const spy = vi.fn();
    events.on('interaction.completed', spy);

    const feature = createInteractionFeature({ events });
    const state = createGameState();
    const next = feature.tick({
      ...state,
      player: { ...state.player, position: { x: -999, y: -999 } },
    });

    expect(spy).not.toHaveBeenCalled();
    expect(next.progression.score).toBe(0);
  });
});
