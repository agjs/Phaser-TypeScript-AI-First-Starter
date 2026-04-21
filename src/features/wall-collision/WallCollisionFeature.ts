import { worldToGrid, type GridState } from '@domain/grid';
import type { PlayerState } from '@domain/player';
import { isBlocked, type TileTypeLookup } from '@domain/wall';

export interface IWallCollisionFeatureDeps {
  readonly grid: GridState;
  readonly tileTypes: TileTypeLookup;
}

export interface IWallCollisionFeature {
  /**
   * Resolves a tentative move. If the tentative position would place the
   * player inside a solid tile, the position is reverted axis-by-axis so
   * the player can slide along a wall rather than sticking to it.
   */
  resolveMove: (previous: PlayerState, tentative: PlayerState) => PlayerState;
}

export const createWallCollisionFeature = (
  deps: IWallCollisionFeatureDeps,
): IWallCollisionFeature => {
  const hitsWall = (p: PlayerState): boolean =>
    isBlocked(deps.grid, worldToGrid(deps.grid, p.position), deps.tileTypes);

  return {
    resolveMove(previous, tentative) {
      if (!hitsWall(tentative)) {
        return tentative;
      }
      // Try X-only, then Y-only, so movement slides along walls.
      const xOnly: PlayerState = {
        ...tentative,
        position: { x: tentative.position.x, y: previous.position.y },
      };

      if (!hitsWall(xOnly)) {
        return { ...xOnly, velocity: { x: tentative.velocity.x, y: 0 } };
      }

      const yOnly: PlayerState = {
        ...tentative,
        position: { x: previous.position.x, y: tentative.position.y },
      };

      if (!hitsWall(yOnly)) {
        return { ...yOnly, velocity: { x: 0, y: tentative.velocity.y } };
      }

      return { ...previous, velocity: { x: 0, y: 0 } };
    },
  };
};
