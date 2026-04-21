import brickRaw from './brick.json' with { type: 'json' };
import emptyRaw from './empty.json' with { type: 'json' };
import steelRaw from './steel.json' with { type: 'json' };
import { TileTypeSchema, type TileType } from '../../schemas/tileType.schema.js';

export const EMPTY_TILE_TYPE: TileType = TileTypeSchema.parse(emptyRaw);
export const BRICK_TILE_TYPE: TileType = TileTypeSchema.parse(brickRaw);
export const STEEL_TILE_TYPE: TileType = TileTypeSchema.parse(steelRaw);

export const ALL_TILE_TYPES: readonly TileType[] = [
  EMPTY_TILE_TYPE,
  BRICK_TILE_TYPE,
  STEEL_TILE_TYPE,
];

const byId = new Map(ALL_TILE_TYPES.map((t) => [t.id, t]));

export const lookupTileType = (id: string): TileType | undefined => byId.get(id);
