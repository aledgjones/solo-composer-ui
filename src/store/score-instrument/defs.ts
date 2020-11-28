import { ClefDrawType } from "../entries/clef/defs";
import { PlayerType } from "../score-player/defs";

export enum Expression {
  Natural,
  Pizzicato,
  Spiccato,
  Staccato,
  Tremolo,
  Mute,
}

export enum InstrumentType {
  Melodic,
  Percussive,
}

export interface Patches {
  [expression: string]: string;
}

export interface Instrument {
  key: string;
  id: string;
  type: InstrumentType;
  long_name: string;
  short_name: string;
  staves: string[];
  volume: number;
  mute: boolean;
  solo: boolean;
}

export interface StaveDef {
  lines: number[];
  clef: {
    draw_as: ClefDrawType;
    pitch: number;
    offset: number;
  };
}

export interface InstrumentDef {
  id: string;
  type: InstrumentType;
  path: string[];
  long_name: string;
  short_name: string;
  staves: StaveDef[];
  patches: {
    [PlayerType.Solo]: Patches;
    [PlayerType.Section]: Patches;
  };
}
