import { createGrid, setTile } from '@domain/grid';
import { createPlayer } from '@domain/player';
import type { TileTypeDescriptor, TileTypeLookup } from '@domain/wall';
import { describe, expect, it } from 'vitest';

import { createWallCollisionFeature } from './WallCollisionFeature.js';

const lookup = (types: readonly TileTypeDescriptor[]): TileTypeLookup => {
  const m = new Map(types.map((t) => [t.id, t]));
  return { get: (id) => m.get(id) };
};

const tileTypes = lookup([
  { id: 'empty', solid: false, destructible: false, displayColor: '#000' },
  { id: 'brick', solid: true, destructible: true, displayColor: '#b35a1b' },
]);

describe('WallCollisionFeature.resolveMove', () => {
  it('passes through a move that does not collide', () => {
    const grid = createGrid({ cols: 4, rows: 4, tileSize: 32 });
    const feature = createWallCollisionFeature({ grid, tileTypes });
    const prev = { ...createPlayer(), position: { x: 16, y: 16 } };
    const tent = { ...prev, position: { x: 48, y: 16 } };
    expect(feature.resolveMove(prev, tent)).toEqual(tent);
  });

  it('fully reverts when neither X-only nor Y-only can slide past walls', () => {
    // Block the target tile and both adjacent single-axis slide destinations.
    let grid = createGrid({ cols: 4, rows: 4, tileSize: 32 });
    grid = setTile(grid, { col: 2, row: 2 }, 'brick');
    grid = setTile(grid, { col: 2, row: 1 }, 'brick'); // blocks X-only slide
    grid = setTile(grid, { col: 1, row: 2 }, 'brick'); // blocks Y-only slide

    const feature = createWallCollisionFeature({ grid, tileTypes });
    const prev = { ...createPlayer(), position: { x: 60, y: 60 } };
    const tent = { ...prev, position: { x: 80, y: 80 }, velocity: { x: 100, y: 100 } };
    const resolved = feature.resolveMove(prev, tent);
    expect(resolved.position).toEqual(prev.position);
    expect(resolved.velocity).toEqual({ x: 0, y: 0 });
  });

  it('slides along a wall: allows X motion while Y is blocked', () => {
    // Wall at (col 1, row 2). Player moving right and down, down is blocked.
    const grid = setTile(
      createGrid({ cols: 4, rows: 4, tileSize: 32 }),
      { col: 1, row: 2 },
      'brick',
    );
    const feature = createWallCollisionFeature({ grid, tileTypes });
    const prev = { ...createPlayer(), position: { x: 36, y: 48 } }; // in (col 1, row 1)
    const tent = { ...prev, position: { x: 48, y: 68 }, velocity: { x: 100, y: 100 } };
    const resolved = feature.resolveMove(prev, tent);
    // X advanced, Y reverted
    expect(resolved.position.x).toBe(48);
    expect(resolved.position.y).toBe(48);
    expect(resolved.velocity).toEqual({ x: 100, y: 0 });
  });
});
