import { lookupTileType } from '@content/definitions/tileTypes/index.js';
import { createGameState, type GameEventMap, type GameState } from '@domain/core';
import type { InteractableState } from '@domain/interaction';
import type { TileTypeLookup } from '@domain/wall';
import { createHudFeature, type IHudRenderer } from '@features/hud';
import { createInteractionFeature } from '@features/interaction';
import { createMovementFeature } from '@features/movement';
import { createSaveGameFeature } from '@features/save-game';
import { createWallCollisionFeature } from '@features/wall-collision';
import { createEventBus } from '@shared/events';
import type { ISaveGamePort } from '@shared/types';
import type * as Phaser from 'phaser';

import { WORLD_HEIGHT, WORLD_WIDTH } from './WorldScene.constants.js';
import {
  createInteractableEntity,
  type IInteractableEntity,
} from '../../entities/InteractableEntity.js';
import { createPlayerEntity, type IPlayerEntity } from '../../entities/PlayerEntity.js';
import { createWallLayerEntity, type IWallLayerEntity } from '../../entities/WallLayerEntity.js';
import { createKeyboardInputPort, type IInputPort } from '../../input/keyboardInput.port.js';

const tileTypes: TileTypeLookup = { get: lookupTileType };

export interface IWorldSceneDeps {
  readonly save: ISaveGamePort;
  readonly hud: IHudRenderer;
}

export interface IWorldSceneRuntime {
  update: (deltaMs: number) => void;
  dispose: () => void;
}

interface SetupContext {
  readonly scene: Phaser.Scene;
  readonly deps: IWorldSceneDeps;
}

export const setupWorldScene = async (ctx: SetupContext): Promise<IWorldSceneRuntime> => {
  const events = createEventBus<GameEventMap>();
  const bounds = {
    min: { x: 16, y: 16 },
    max: { x: WORLD_WIDTH - 16, y: WORLD_HEIGHT - 16 },
  };

  let state: GameState = createGameState();

  const input: IInputPort = createKeyboardInputPort(ctx.scene);
  const movement = createMovementFeature({ events, bounds });
  const interaction = createInteractionFeature({ events });
  const wallCollision = createWallCollisionFeature({ grid: state.grid, tileTypes });
  const hud = createHudFeature({ events, renderer: ctx.deps.hud });
  const save = createSaveGameFeature({
    events,
    port: ctx.deps.save,
    getState: () => state,
  });

  const wallLayer: IWallLayerEntity = createWallLayerEntity(ctx.scene, state.grid, tileTypes);
  const playerEntity: IPlayerEntity = createPlayerEntity(ctx.scene, state.player);
  const interactableEntities = new Map<string, IInteractableEntity>(
    state.interactables.map((i) => [i.id, createInteractableEntity(ctx.scene, i)]),
  );

  const saveKey = ctx.scene.input.keyboard?.addKey('S');
  saveKey?.on('down', () => events.emit('saveGame.requested', {}));

  const resetKey = ctx.scene.input.keyboard?.addKey('R');
  resetKey?.on('down', () => {
    state = createGameState();
    playerEntity.render(state.player);

    for (const [id, entity] of interactableEntities) {
      const found = state.interactables.find((i: InteractableState) => i.id === id);

      if (found) {
        entity.render(found);
      }
    }

    events.emit('progression.updated', { score: 0 });
  });

  const loaded = await save.load();
  if (loaded) {
    state = {
      ...state,
      progression: {
        score: loaded.score,
        consumedIds: new Set(loaded.consumedIds),
      },
      interactables: state.interactables.map((i) =>
        loaded.consumedIds.includes(i.id) ? { ...i, consumed: true } : i,
      ),
    };

    for (const i of state.interactables) {
      interactableEntities.get(i.id)?.render(i);
    }
  }

  return {
    update(deltaMs) {
      const intent = input.currentIntent();
      const previousPlayer = state.player;
      const afterMove = movement.tick(state, intent, deltaMs);
      const resolvedPlayer = wallCollision.resolveMove(previousPlayer, afterMove.player);
      state = { ...afterMove, player: resolvedPlayer };
      state = interaction.tick(state);

      playerEntity.render(state.player);

      for (const i of state.interactables) {
        interactableEntities.get(i.id)?.render(i);
      }
    },
    dispose() {
      hud.dispose();
      save.dispose();
      input.destroy();
      events.clear();
      wallLayer.destroy();
      playerEntity.destroy();
      for (const e of interactableEntities.values()) {
        e.destroy();
      }
    },
  };
};
