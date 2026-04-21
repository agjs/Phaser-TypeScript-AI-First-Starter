import { distanceSq } from '@shared/types';

import { DEFAULT_PLAYER_RADIUS } from './Interaction.constants.js';
import type { InteractableState, InteractionEvent } from './Interaction.types.js';
import type { PlayerState } from '../player/Player.types.js';

export const resolveOverlap = (
  player: PlayerState,
  interactable: InteractableState,
  playerRadius: number = DEFAULT_PLAYER_RADIUS,
): InteractionEvent | null => {
  if (interactable.consumed) {
    return null;
  }

  const thresh = interactable.radius + playerRadius;
  if (distanceSq(player.position, interactable.position) > thresh * thresh) {
    return null;
  }

  return { interactableId: interactable.id };
};
