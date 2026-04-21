import type { Vec2 } from '@shared/types';

import type { InteractionEvent } from '../interaction/Interaction.types.js';

export interface GameEventMap {
  'player.moved': { readonly position: Vec2 };
  'interaction.completed': InteractionEvent;
  'progression.updated': { readonly score: number };
  'saveGame.requested': Record<string, never>;
  'saveGame.completed': { readonly ok: boolean };
  'saveGame.loaded': { readonly score: number };
}
