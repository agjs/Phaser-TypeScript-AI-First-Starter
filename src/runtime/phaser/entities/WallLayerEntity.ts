import type { GridState } from '@domain/grid';
import type { TileTypeLookup } from '@domain/wall';
import type * as Phaser from 'phaser';

export interface IWallLayerEntity {
  destroy: () => void;
}

export const createWallLayerEntity = (
  scene: Phaser.Scene,
  grid: GridState,
  tileTypes: TileTypeLookup,
): IWallLayerEntity => {
  const rectangles: Phaser.GameObjects.Rectangle[] = [];

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
      const x = grid.origin.x + col * grid.tileSize + grid.tileSize / 2;
      const y = grid.origin.y + row * grid.tileSize + grid.tileSize / 2;
      const color = Number.parseInt(descriptor.displayColor.replace('#', ''), 16);
      const rect = scene.add
        .rectangle(x, y, grid.tileSize, grid.tileSize, color)
        .setStrokeStyle(1, 0x000000);
      rectangles.push(rect);
    }
  }

  return {
    destroy() {
      for (const r of rectangles) {
        r.destroy();
      }
      rectangles.length = 0;
    },
  };
};
