import type { ITimePort } from '@shared/types';

export const createBrowserTimePort = (): ITimePort => ({
  now: () => performance.now(),
});
