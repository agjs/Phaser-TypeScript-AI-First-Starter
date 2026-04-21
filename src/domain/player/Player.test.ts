import { describe, expect, it } from 'vitest';

import { applyMoveIntent } from './Player.behavior.js';
import { PLAYER_SPEED_PX_PER_SEC } from './Player.constants.js';
import { createPlayer } from './Player.model.js';

describe('Player.applyMoveIntent', () => {
  it('is a no-op for zero intent', () => {
    const p = createPlayer();
    const next = applyMoveIntent(p, { dx: 0, dy: 0 }, 16);
    expect(next.position).toEqual(p.position);
    expect(next.velocity).toEqual({ x: 0, y: 0 });
  });

  it('moves right at the configured speed', () => {
    const p = createPlayer();
    const next = applyMoveIntent(p, { dx: 1, dy: 0 }, 1000);
    expect(next.position.x).toBeCloseTo(p.position.x + PLAYER_SPEED_PX_PER_SEC);
    expect(next.position.y).toBeCloseTo(p.position.y);
    expect(next.velocity.x).toBe(PLAYER_SPEED_PX_PER_SEC);
  });

  it('normalizes diagonal movement to the same speed', () => {
    const p = createPlayer();
    const horizontal = applyMoveIntent(p, { dx: 1, dy: 0 }, 1000);
    const diagonal = applyMoveIntent(p, { dx: 1, dy: 1 }, 1000);

    const dxH = horizontal.position.x - p.position.x;
    const dyH = horizontal.position.y - p.position.y;
    const dxD = diagonal.position.x - p.position.x;
    const dyD = diagonal.position.y - p.position.y;

    expect(Math.hypot(dxH, dyH)).toBeCloseTo(Math.hypot(dxD, dyD));
  });

  it('does not mutate the input state', () => {
    const p = createPlayer();
    const frozenBefore = { ...p.position };
    applyMoveIntent(p, { dx: 1, dy: 0 }, 100);
    expect(p.position).toEqual(frozenBefore);
  });
});
