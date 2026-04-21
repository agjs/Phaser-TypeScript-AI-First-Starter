import { describe, expect, it } from 'vitest';

import { clampToBounds } from './Movement.behavior.js';

describe('Movement.clampToBounds', () => {
  const bounds = { min: { x: 0, y: 0 }, max: { x: 100, y: 100 } };

  it('passes through in-bounds positions', () => {
    expect(clampToBounds({ x: 50, y: 50 }, bounds)).toEqual({ x: 50, y: 50 });
  });

  it('clamps x below min', () => {
    expect(clampToBounds({ x: -10, y: 50 }, bounds)).toEqual({ x: 0, y: 50 });
  });

  it('clamps y above max', () => {
    expect(clampToBounds({ x: 50, y: 200 }, bounds)).toEqual({ x: 50, y: 100 });
  });

  it('clamps both axes', () => {
    expect(clampToBounds({ x: 200, y: -10 }, bounds)).toEqual({ x: 100, y: 0 });
  });
});
