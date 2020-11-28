import { Entry, Accidental, EntryType } from "..";
import { ClefDrawType } from "../clef/defs";

export enum KeySignatureMode {
  Major = 1,
  Minor,
}

export interface KeySignature extends Entry {
  type: EntryType.KeySignature;
  mode: KeySignatureMode;
  offset: number;
}

interface Patterns {
  [clefType: string]: {
    [clefOffset: number]: {
      [Accidental: number]: number[];
    };
  };
}

export const key_signature_patterns: Patterns = {
  [ClefDrawType.C]: {
    2: {
      [Accidental.Flat]: [1, 4, 0, 3, -1, 2, -2],
      [Accidental.Natural]: [],
      [Accidental.Sharp]: [-2, 2, -1, 3, 0, 4, 1],
    },
    0: {
      [Accidental.Flat]: [-1, 2, -2, 1, -3, 0, -4],
      [Accidental.Natural]: [],
      [Accidental.Sharp]: [3, 0, 4, 1, -2, 2, -1],
    },
  },
  [ClefDrawType.F]: {
    2: {
      [Accidental.Flat]: [-2, 1, -3, 0, -4, -1, -5],
      [Accidental.Natural]: [],
      [Accidental.Sharp]: [2, -1, 3, 0, -3, 1, -2],
    },
  },
  [ClefDrawType.G]: {
    [-2]: {
      [Accidental.Flat]: [0, 3, -1, 2, -2, 1, -3],
      [Accidental.Natural]: [],
      [Accidental.Sharp]: [4, 1, 5, 2, -1, 3, 0],
    },
  },
};
