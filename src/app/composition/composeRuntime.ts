import type { IRandomPort, ISaveGamePort, ITimePort } from '@shared/types';

import {
  createBrowserRandomPort,
  createBrowserTimePort,
  createLocalStorageSavePort,
} from '../../runtime/adapters/index.js';

export interface IComposedPorts {
  readonly time: ITimePort;
  readonly random: IRandomPort;
  readonly save: ISaveGamePort;
}

/**
 * Wires concrete adapters into the shared port interfaces.
 *
 * This is the only place where runtime adapters are instantiated at the app
 * level. Scenes that need scene-bound adapters (audio, rendering) create
 * those in scene setup since they depend on the Phaser.Scene instance.
 */
export const composePorts = (): IComposedPorts => ({
  time: createBrowserTimePort(),
  random: createBrowserRandomPort(),
  save: createLocalStorageSavePort(),
});
