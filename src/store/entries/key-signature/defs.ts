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

interface KeyOffsetMap {
  [key: string]: number;
}

const majorKeys: KeyOffsetMap = {
  Cb: -7,
  Gb: -6,
  Db: -5,
  Ab: -4,
  Eb: -3,
  Bb: -2,
  F: -1,
  C: 0,
  G: 1,
  D: 2,
  A: 3,
  E: 4,
  B: 5,
  "F#": 6,
  "C#": 7,
};

const minorKeys: KeyOffsetMap = {
  ab: -7,
  eb: -6,
  bb: -5,
  f: -4,
  c: -3,
  g: -2,
  d: -1,
  a: 0,
  e: 1,
  b: 2,
  "f#": 3,
  "c#": 4,
  "g#": 5,
  "d#": 6,
  "a#": 7,
};

export function offsetFromKey(key: string) {
  if (majorKeys[key]) {
    return majorKeys[key];
  } else if (minorKeys[key]) {
    return minorKeys[key];
  } else {
    return null;
  }
}

export function modeFromKey(key: string) {
  if (key[0] === key[0].toUpperCase()) {
    return KeySignatureMode.Major;
  } else {
    return KeySignatureMode.Minor;
  }
}
