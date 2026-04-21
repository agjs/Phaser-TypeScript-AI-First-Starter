import { vec2, type Vec2 } from '@shared/types';
import { clamp } from '@shared/utils';

import type { Bounds } from './Movement.types.js';

export const clampToBounds = (position: Vec2, bounds: Bounds): Vec2 =>
  vec2(
    clamp(position.x, bounds.min.x, bounds.max.x),
    clamp(position.y, bounds.min.y, bounds.max.y),
  );
