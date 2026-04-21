import { vec2, type Vec2 } from '@shared/types';

import { DEFAULT_TILE_SIZE, EMPTY_TILE } from './Grid.constants.js';
import type { GridState } from './Grid.types.js';

export interface CreateGridInput {
  readonly cols: number;
  readonly rows: number;
  readonly tileSize?: number;
  readonly origin?: Vec2;
  readonly fill?: string;
}

export const createGrid = (input: CreateGridInput): GridState => {
  const tileSize = input.tileSize ?? DEFAULT_TILE_SIZE;
  const origin = input.origin ?? vec2(0, 0);
  const fill = input.fill ?? EMPTY_TILE;
  const tiles = new Array<string>(input.cols * input.rows).fill(fill);

  return { cols: input.cols, rows: input.rows, tileSize, origin, tiles };
};
