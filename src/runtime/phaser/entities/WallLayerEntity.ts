import type { GridState } from '@domain/grid';
import type { TileTypeLookup } from '@domain/wall';
import type * as Phaser from 'phaser';

export interface IWallLayerEntity {
  redraw: (grid: GridState) => void;
  destroy: () => void;
}

/**
 * Renders all solid tiles in a single Phaser.Graphics batch rather than one
 * Rectangle GameObject per tile. With e.g. 30x17 grids this turns hundreds
 * of scene-graph nodes into one, which matters for input/render perf and for
 * the eventual tank game's larger levels.
 */
export const createWallLayerEntity = (
  scene: Phaser.Scene,
  initialGrid: GridState,
  tileTypes: TileTypeLookup,
): IWallLayerEntity => {
  const graphics = scene.add.graphics();
  graphics.setDepth(0);

  const draw = (grid: GridState): void => {
    graphics.clear();
    for (let row = 0; row < grid.rows; row += 1) {
      for (let col = 0; col < grid.cols; col += 1) {
        const id = grid.tiles[row * grid.cols + col];
        if (!id) {
          continue;
        }
        const descriptor = tileTypes.get(id);
        if (!descriptor?.solid) {
          continue;
        }
        const x = grid.origin.x + col * grid.tileSize;
        const y = grid.origin.y + row * grid.tileSize;
        const color = Number.parseInt(descriptor.displayColor.replace('#', ''), 16);
        graphics.fillStyle(color, 1);
        graphics.fillRect(x, y, grid.tileSize, grid.tileSize);
        graphics.lineStyle(1, 0x000000, 1);
        graphics.strokeRect(x, y, grid.tileSize, grid.tileSize);
      }
    }
  };

  draw(initialGrid);

  return {
    redraw: draw,
    destroy() {
      graphics.destroy();
    },
  };
};
