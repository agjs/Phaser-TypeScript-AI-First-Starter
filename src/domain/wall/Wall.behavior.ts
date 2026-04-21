import type { TileTypeLookup } from './Wall.types.js';
import { getTile, type GridState, type TileCoord } from '../grid/index.js';

export const isBlocked = (
  grid: GridState,
  coord: TileCoord,
  tileTypes: TileTypeLookup,
): boolean => {
  const tileId = getTile(grid, coord);
  const descriptor = tileTypes.get(tileId);
  return descriptor?.solid ?? false;
};

export const isDestructible = (
  grid: GridState,
  coord: TileCoord,
  tileTypes: TileTypeLookup,
): boolean => {
  const tileId = getTile(grid, coord);
  const descriptor = tileTypes.get(tileId);
  return descriptor?.destructible ?? false;
};
