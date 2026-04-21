import { describe, expect, it } from 'vitest';

import {
  getTile,
  gridToWorld,
  isInBounds,
  setTile,
  tileBounds,
  worldToGrid,
} from './Grid.behavior.js';
import { EMPTY_TILE } from './Grid.constants.js';
import { createGrid } from './Grid.model.js';

describe('Grid', () => {
  it('createGrid fills with the empty-tile id by default', () => {
    const g = createGrid({ cols: 3, rows: 2 });
    expect(g.tiles).toHaveLength(6);
    expect(g.tiles.every((t) => t === EMPTY_TILE)).toBe(true);
  });

  it('setTile replaces one cell without mutating the original', () => {
    const g = createGrid({ cols: 2, rows: 2 });
    const next = setTile(g, { col: 1, row: 0 }, 'wall');
    expect(getTile(next, { col: 1, row: 0 })).toBe('wall');
    expect(getTile(g, { col: 1, row: 0 })).toBe(EMPTY_TILE);
  });

  it('getTile out of bounds returns empty, does not throw', () => {
    const g = createGrid({ cols: 2, rows: 2 });
    expect(getTile(g, { col: -1, row: 0 })).toBe(EMPTY_TILE);
    expect(getTile(g, { col: 5, row: 5 })).toBe(EMPTY_TILE);
  });

  it('isInBounds reports correctly at the edges', () => {
    const g = createGrid({ cols: 3, rows: 3 });
    expect(isInBounds(g, { col: 0, row: 0 })).toBe(true);
    expect(isInBounds(g, { col: 2, row: 2 })).toBe(true);
    expect(isInBounds(g, { col: 3, row: 0 })).toBe(false);
    expect(isInBounds(g, { col: -1, row: 0 })).toBe(false);
  });

  it('worldToGrid and gridToWorld roundtrip the center of a tile', () => {
    const g = createGrid({ cols: 4, rows: 4, tileSize: 32 });
    const center = gridToWorld(g, { col: 2, row: 1 });
    expect(center).toEqual({ x: 80, y: 48 });
    expect(worldToGrid(g, center)).toEqual({ col: 2, row: 1 });
  });

  it('tileBounds returns min/max corners', () => {
    const g = createGrid({ cols: 2, rows: 2, tileSize: 16 });
    expect(tileBounds(g, { col: 1, row: 0 })).toEqual({
      min: { x: 16, y: 0 },
      max: { x: 32, y: 16 },
    });
  });

  it('setTile ignores out-of-bounds writes', () => {
    const g = createGrid({ cols: 2, rows: 2 });
    const next = setTile(g, { col: 99, row: 99 }, 'wall');
    expect(next).toBe(g);
  });
});
