import exampleItemRaw from './example-item.json' with { type: 'json' };
import { ItemSchema, type Item } from '../../schemas/item.schema.js';

/**
 * Content is validated at import time. A malformed JSON file will crash the
 * dev server / build — catch bad content early, not at runtime.
 */
export const EXAMPLE_COIN: Item = ItemSchema.parse(exampleItemRaw);

export const ALL_ITEMS: readonly Item[] = [EXAMPLE_COIN];
