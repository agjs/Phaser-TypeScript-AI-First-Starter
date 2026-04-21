/* eslint-disable */
// Example: a well-formed domain behavior. Pure, tested, deterministic.

interface PlayerState {
  readonly position: { x: number; y: number };
  readonly hp: number;
}

export const applyDamage = (state: PlayerState, amount: number): PlayerState => {
  if (amount <= 0) {
    return state;
  }
  return { ...state, hp: Math.max(0, state.hp - amount) };
};

// Why this is "good":
//  - Takes state + args, returns new state
//  - No mutation of input
//  - No Date.now, Math.random, or engine calls
//  - Trivially unit-testable — no ports needed
//  - Single responsibility: damage application
