export type { PlayerState } from './Player.types.js';
export { createPlayer } from './Player.model.js';
export { applyMoveIntent } from './Player.behavior.js';
export type { MoveIntent } from './Player.behavior.js';
export {
  PLAYER_SPEED_PX_PER_SEC,
  PLAYER_START_POSITION,
  PLAYER_SIZE_PX,
  PLAYER_HALF_EXTENT_PX,
} from './Player.constants.js';
