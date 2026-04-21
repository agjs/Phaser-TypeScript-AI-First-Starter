import { interactableId } from './ids.js';
import { createGrid, setTile, type GridState, type TileCoord } from '../grid/index.js';
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
  readonly grid: GridState;
}

const DEMO_WALLS: readonly { readonly coord: TileCoord; readonly id: string }[] = [
  { coord: { col: 8, row: 6 }, id: 'brick' },
  { coord: { col: 9, row: 6 }, id: 'brick' },
  { coord: { col: 10, row: 6 }, id: 'brick' },
  { coord: { col: 11, row: 6 }, id: 'brick' },
  { coord: { col: 15, row: 3 }, id: 'steel' },
  { coord: { col: 15, row: 4 }, id: 'steel' },
  { coord: { col: 20, row: 8 }, id: 'brick' },
  { coord: { col: 21, row: 8 }, id: 'brick' },
  { coord: { col: 22, row: 8 }, id: 'brick' },
];

export const createGameState = (): GameState => {
  const gridBase = createGrid({
    cols: 30,
    rows: 17,
    tileSize: 32,
    origin: { x: 0, y: 0 },
  });
  const grid = DEMO_WALLS.reduce((g, w) => setTile(g, w.coord, w.id), gridBase);

  return {
    player: createPlayer(),
    interactables: [
      createInteractable(interactableId('i1'), 200, 100),
      createInteractable(interactableId('i2'), 600, 420),
      createInteractable(interactableId('i3'), 120, 400),
    ],
    progression: createProgression(),
    grid,
  };
};
