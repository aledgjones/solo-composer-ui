export enum EntryType {
  TimeSignature,
  AbsoluteTempo,
  Clef,
  Tone,
  Barline,
  KeySignature,
}

export interface Entry {
  key: string;
  tick: number;
  type: EntryType;
}

export interface Box {
  height: number;
  width: number;
}

export enum NoteDuration {
  Whole = 1,
  Half = 2,
  Quarter = 4,
  Eighth = 8,
  Sixteenth = 16,
  ThirtySecond = 32,
}

export enum DottedValue {
  None,
  Single,
  Double,
}

export enum Articulation {
  None,
  Staccato,
  Staccatissimo,
  Tenuto,
  StaccatoTenuto,
}

export enum Accidental {
  DoubleSharp = 2,
  Sharp = 1,
  Natural = 0,
  Flat = -1,
  DoubleFlat = -2,
}

export interface Pitch {
  int: number;
  accidental: Accidental;
}
