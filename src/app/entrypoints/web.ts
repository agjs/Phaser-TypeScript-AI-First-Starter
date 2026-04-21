import { bootstrapGame } from '../bootstrap/bootstrap.js';

export const startWebGame = (parentSelector = '#game'): void => {
  const parent = document.querySelector<HTMLElement>(parentSelector);

  if (!parent) {
    throw new Error(`Parent element not found for selector: ${parentSelector}`);
  }

  bootstrapGame(parent);
};
