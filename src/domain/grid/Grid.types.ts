import type { Vec2 } from '@shared/types';

export interface TileCoord {
  readonly col: number;
  readonly row: number;
}

/**
 * A 2D grid of string tile-type ids.
 * Empty tiles are represented by the string 'empty' (not `undefined`).
 * Stored row-major in a 1D array for cache friendliness and cheap structural sharing.
 */
export interface GridState {
  readonly cols: number;
  readonly rows: number;
  readonly tileSize: number;
  readonly tiles: ReadonlyArray<string>;
  readonly origin: Vec2;
}
