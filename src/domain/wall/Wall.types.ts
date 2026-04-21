export interface TileTypeLookup {
  readonly get: (id: string) => TileTypeDescriptor | undefined;
}

export interface TileTypeDescriptor {
  readonly id: string;
  readonly solid: boolean;
  readonly destructible: boolean;
  readonly displayColor: string;
}
