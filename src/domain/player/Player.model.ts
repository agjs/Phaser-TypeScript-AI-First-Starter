import { vec2 } from '@shared/types';

import { PLAYER_START_POSITION } from './Player.constants.js';
import type { PlayerState } from './Player.types.js';
import { playerId, type PlayerId } from '../core/ids.js';

export const createPlayer = (id: PlayerId = playerId('p1')): PlayerState => ({
  id,
  position: vec2(PLAYER_START_POSITION.x, PLAYER_START_POSITION.y),
  velocity: vec2(0, 0),
});
