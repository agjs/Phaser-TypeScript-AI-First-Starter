import { z } from 'zod';

export const LevelSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .min(1),
  displayName: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  playerStart: z.object({ x: z.number(), y: z.number() }),
});

export type Level = z.infer<typeof LevelSchema>;
