import { describe, expect, it } from 'vitest';

import { isBlocked, isDestructible } from './Wall.behavior.js';
import type { TileTypeDescriptor, TileTypeLookup } from './Wall.types.js';
import { createGrid, setTile } from '../grid/index.js';

const lookup = (types: readonly TileTypeDescriptor[]): TileTypeLookup => {
  const m = new Map(types.map((t) => [t.id, t]));
  return { get: (id) => m.get(id) };
};

const types = lookup([
  { id: 'empty', solid: false, destructible: false, displayColor: '#000000' },
  { id: 'brick', solid: true, destructible: true, displayColor: '#b35a1b' },
  { id: 'steel', solid: true, destructible: false, displayColor: '#808080' },
]);

describe('Wall.isBlocked', () => {
  it('returns true for solid tiles', () => {
    const g = setTile(createGrid({ cols: 3, rows: 3 }), { col: 1, row: 1 }, 'brick');
    expect(isBlocked(g, { col: 1, row: 1 }, types)).toBe(true);
  });

  it('returns false for empty tiles', () => {
    const g = createGrid({ cols: 3, rows: 3 });
    expect(isBlocked(g, { col: 0, row: 0 }, types)).toBe(false);
  });

  it('returns false for unknown tile ids', () => {
    const g = setTile(createGrid({ cols: 3, rows: 3 }), { col: 0, row: 0 }, 'mystery');
    expect(isBlocked(g, { col: 0, row: 0 }, types)).toBe(false);
  });
});

describe('Wall.isDestructible', () => {
  it('true for brick, false for steel', () => {
    const g = setTile(
      setTile(createGrid({ cols: 3, rows: 3 }), { col: 0, row: 0 }, 'brick'),
      { col: 1, row: 0 },
      'steel',
    );
    expect(isDestructible(g, { col: 0, row: 0 }, types)).toBe(true);
    expect(isDestructible(g, { col: 1, row: 0 }, types)).toBe(false);
  });
});
