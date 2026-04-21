export interface ProgressionState {
  readonly score: number;
  readonly consumedIds: ReadonlySet<string>;
}
