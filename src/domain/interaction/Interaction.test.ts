import { describe, expect, it } from 'vitest';

import { resolveOverlap } from './Interaction.behavior.js';
import { createInteractable, markConsumed } from './Interaction.model.js';
import { createPlayer } from '../player/Player.model.js';

describe('Interaction.resolveOverlap', () => {
  it('returns an event when player overlaps interactable', () => {
    const p = { ...createPlayer(), position: { x: 100, y: 100 } };
    const i = createInteractable(undefined, 100, 100);
    const e = resolveOverlap(p, i);
    expect(e).not.toBeNull();
    expect(e?.interactableId).toBe(i.id);
  });

  it('returns null when far apart', () => {
    const p = { ...createPlayer(), position: { x: 0, y: 0 } };
    const i = createInteractable(undefined, 500, 500);
    expect(resolveOverlap(p, i)).toBeNull();
  });

  it('returns null when interactable is already consumed', () => {
    const p = { ...createPlayer(), position: { x: 100, y: 100 } };
    const i = markConsumed(createInteractable(undefined, 100, 100));
    expect(resolveOverlap(p, i)).toBeNull();
  });
});
