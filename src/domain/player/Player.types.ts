import type { Vec2 } from '@shared/types';

import type { PlayerId } from '../core/ids.js';

export interface PlayerState {
  readonly id: PlayerId;
  readonly position: Vec2;
  readonly velocity: Vec2;
}
