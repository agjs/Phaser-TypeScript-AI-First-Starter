import { vec2, type Vec2 } from '@shared/types';

import { EMPTY_TILE } from './Grid.constants.js';
import type { GridState, TileCoord } from './Grid.types.js';

export const isInBounds = (grid: GridState, coord: TileCoord): boolean =>
  coord.col >= 0 && coord.col < grid.cols && coord.row >= 0 && coord.row < grid.rows;

export const getTile = (grid: GridState, coord: TileCoord): string => {
  if (!isInBounds(grid, coord)) {
    return EMPTY_TILE;
  }

  return grid.tiles[coord.row * grid.cols + coord.col] ?? EMPTY_TILE;
};

export const setTile = (grid: GridState, coord: TileCoord, tileTypeId: string): GridState => {
  if (!isInBounds(grid, coord)) {
    return grid;
  }

  const index = coord.row * grid.cols + coord.col;
  const tiles = grid.tiles.slice();
  tiles[index] = tileTypeId;

  return { ...grid, tiles };
};

export const worldToGrid = (grid: GridState, world: Vec2): TileCoord => ({
  col: Math.floor((world.x - grid.origin.x) / grid.tileSize),
  row: Math.floor((world.y - grid.origin.y) / grid.tileSize),
});

export const gridToWorld = (grid: GridState, coord: TileCoord): Vec2 =>
  vec2(
    grid.origin.x + coord.col * grid.tileSize + grid.tileSize / 2,
    grid.origin.y + coord.row * grid.tileSize + grid.tileSize / 2,
  );

export const tileBounds = (
  grid: GridState,
  coord: TileCoord,
): { readonly min: Vec2; readonly max: Vec2 } => {
  const min = vec2(
    grid.origin.x + coord.col * grid.tileSize,
    grid.origin.y + coord.row * grid.tileSize,
  );

  const max = vec2(min.x + grid.tileSize, min.y + grid.tileSize);

  return { min, max };
};
