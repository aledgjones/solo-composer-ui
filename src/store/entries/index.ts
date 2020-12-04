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

/**
 * Converts a int value to a full pitch with appropriate accidental
 * // TODO: Make this more sophisticated
 */
export function pitch_from_number(pitch: number): Pitch {
  let step = pitch % 12;
  switch (step) {
    case 0:
    case 2:
    case 4:
    case 5:
    case 7:
    case 9:
    case 10:
      return { int: pitch, accidental: Accidental.Natural };
    default:
      return { int: pitch, accidental: Accidental.Sharp };
  }
}

/** Returns pitch parts [letter, accidental, octave] */
export function pitch_to_parts(pitch: Pitch): [string, Accidental, number] {
  const letters: { [key: number]: string } = {
    0: "C",
    2: "D",
    4: "E",
    5: "F",
    7: "G",
    9: "A",
    11: "B",
  };
  const C0 = 12;
  const octave = Math.floor((pitch.int - pitch.accidental - C0) / 12);
  const letter = letters[(pitch.int - pitch.accidental - C0) % 12];
  return [letter, pitch.accidental, octave];
}
