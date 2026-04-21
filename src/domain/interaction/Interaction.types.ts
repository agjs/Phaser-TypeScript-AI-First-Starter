import type { Vec2 } from '@shared/types';

import type { InteractableId } from '../core/ids.js';

export interface InteractableState {
  readonly id: InteractableId;
  readonly position: Vec2;
  readonly radius: number;
  readonly consumed: boolean;
}

export interface InteractionEvent {
  readonly interactableId: InteractableId;
}
