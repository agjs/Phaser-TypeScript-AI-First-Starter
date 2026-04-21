import { interactableId } from './ids.js';
import { createInteractable } from '../interaction/Interaction.model.js';
import type { InteractableState } from '../interaction/Interaction.types.js';
import { createPlayer } from '../player/Player.model.js';
import type { PlayerState } from '../player/Player.types.js';
import { createProgression } from '../progression/Progression.model.js';
import type { ProgressionState } from '../progression/Progression.types.js';

export interface GameState {
  readonly player: PlayerState;
  readonly interactables: readonly InteractableState[];
  readonly progression: ProgressionState;
}

export const createGameState = (): GameState => ({
  player: createPlayer(),
  interactables: [
    createInteractable(interactableId('i1'), 300, 200),
    createInteractable(interactableId('i2'), 600, 360),
    createInteractable(interactableId('i3'), 480, 120),
  ],
  progression: createProgression(),
});
