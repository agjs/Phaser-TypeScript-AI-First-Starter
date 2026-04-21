import { vec2 } from '@shared/types';

import { DEFAULT_INTERACTABLE_RADIUS } from './Interaction.constants.js';
import type { InteractableState } from './Interaction.types.js';
import { interactableId, type InteractableId } from '../core/ids.js';

export const createInteractable = (
  id: InteractableId = interactableId('i1'),
  x = 480,
  y = 270,
  radius = DEFAULT_INTERACTABLE_RADIUS,
): InteractableState => ({
  id,
  position: vec2(x, y),
  radius,
  consumed: false,
});

export const markConsumed = (state: InteractableState): InteractableState => ({
  ...state,
  consumed: true,
});
