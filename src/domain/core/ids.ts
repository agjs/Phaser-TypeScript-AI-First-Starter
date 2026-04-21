import type { Brand } from '@shared/types';

export type PlayerId = Brand<string, 'PlayerId'>;
export type InteractableId = Brand<string, 'InteractableId'>;

export const playerId = (s: string): PlayerId => s as PlayerId;
export const interactableId = (s: string): InteractableId => s as InteractableId;
