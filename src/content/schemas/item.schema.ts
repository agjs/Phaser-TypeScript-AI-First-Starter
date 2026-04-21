import { z } from 'zod';

export const ItemSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Item id must be kebab-case ASCII')
    .min(1),
  displayName: z.string().min(1),
  stackable: z.boolean(),
  maxStack: z.number().int().positive(),
  tags: z.array(z.string()).default([]),
});

export type Item = z.infer<typeof ItemSchema>;

export const ItemCollectionSchema = z.array(ItemSchema);
