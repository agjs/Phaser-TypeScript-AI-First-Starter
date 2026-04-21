import { z } from 'zod';

export const TileTypeSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Tile type id must be kebab-case ASCII')
    .min(1),
  displayName: z.string().min(1),
  solid: z.boolean(),
  destructible: z.boolean(),
  displayColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'displayColor must be a #rrggbb hex'),
});

export type TileType = z.infer<typeof TileTypeSchema>;
