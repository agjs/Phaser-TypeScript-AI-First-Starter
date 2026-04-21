export interface ISaveGamePayload {
  readonly version: 1;
  readonly score: number;
  readonly consumedIds: readonly string[];
}
