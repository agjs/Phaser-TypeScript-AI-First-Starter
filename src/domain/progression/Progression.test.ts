import { describe, expect, it } from 'vitest';

import { recordInteraction } from './Progression.behavior.js';
import { createProgression } from './Progression.model.js';
import { interactableId } from '../core/ids.js';

describe('Progression.recordInteraction', () => {
  it('increments score on first interaction with an id', () => {
    const state = createProgression();
    const next = recordInteraction(state, { interactableId: interactableId('a') });
    expect(next.score).toBe(1);
    expect(next.consumedIds.has('a')).toBe(true);
  });

  it('is idempotent per interactable id', () => {
    const state = createProgression();
    const id = interactableId('a');
    const once = recordInteraction(state, { interactableId: id });
    const twice = recordInteraction(once, { interactableId: id });
    expect(twice.score).toBe(1);
  });

  it('accumulates across different ids', () => {
    const state = createProgression();
    const a = recordInteraction(state, { interactableId: interactableId('a') });
    const b = recordInteraction(a, { interactableId: interactableId('b') });
    expect(b.score).toBe(2);
  });

  it('does not mutate input state', () => {
    const state = createProgression();
    recordInteraction(state, { interactableId: interactableId('a') });
    expect(state.score).toBe(0);
    expect(state.consumedIds.size).toBe(0);
  });
});
