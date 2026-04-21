import { worldToGrid, type GridState } from '@domain/grid';
import { PLAYER_HALF_EXTENT_PX, type PlayerState } from '@domain/player';
import { isBlocked, type TileTypeLookup } from '@domain/wall';

export interface IWallCollisionFeatureDeps {
  /**
   * A getter so the feature reflects the current grid even if the caller
   * replaces the aggregate (e.g. on scene reset). Accepts a `GridState` for
   * callers with a static grid.
   */
  readonly grid: GridState | (() => GridState);
  readonly tileTypes: TileTypeLookup;
  /**
   * Half the player's AABB extent on each axis, in world pixels.
   * Collision is checked against the four corners of the player's bounding box
   * rather than its center — a point-based check would let the player sink
   * up to half its size into a wall before registering a hit.
   */
  readonly playerHalfExtent?: number;
}

export interface IWallCollisionFeature {
  /**
   * Resolves a tentative move. If the tentative AABB intersects a solid tile,
   * the position is reverted axis-by-axis so the player slides along a wall
   * rather than sticking.
   */
  resolveMove: (previous: PlayerState, tentative: PlayerState) => PlayerState;
}

export const createWallCollisionFeature = (
  deps: IWallCollisionFeatureDeps,
): IWallCollisionFeature => {
  const halfExtent = deps.playerHalfExtent ?? PLAYER_HALF_EXTENT_PX;
  const getGrid: () => GridState =
    typeof deps.grid === 'function' ? deps.grid : () => deps.grid as GridState;

  const hitsWall = (p: PlayerState): boolean => {
    const grid = getGrid();
    const { x, y } = p.position;
    const corners: ReadonlyArray<readonly [number, number]> = [
      [x - halfExtent, y - halfExtent],
      [x + halfExtent - 1, y - halfExtent],
      [x - halfExtent, y + halfExtent - 1],
      [x + halfExtent - 1, y + halfExtent - 1],
    ];
    for (const [cx, cy] of corners) {
      if (isBlocked(grid, worldToGrid(grid, { x: cx, y: cy }), deps.tileTypes)) {
        return true;
      }
    }
    return false;
  };

  return {
    resolveMove(previous, tentative) {
      if (!hitsWall(tentative)) {
        return tentative;
      }
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
