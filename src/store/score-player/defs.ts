export enum PlayerType {
  Solo,
  Section,
}

export interface Player {
  key: string;
  type: PlayerType;
  instruments: string[];
  name?: string;
}
