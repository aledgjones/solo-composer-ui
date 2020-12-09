import { Accidental, Pitch } from "./defs";
const C0 = 12;

/**
 * Converts a int value to a full pitch with appropriate accidental
 * // TODO: Make this more sophisticated
 */
export function pitchFromNumber(pitch: number): Pitch {
  let step = (C0 + pitch) % 12;
  switch (step) {
    case 0:
    case 2:
    case 4:
    case 5:
    case 7:
    case 9:
    case 11:
      return { int: pitch, accidental: Accidental.Natural };
    default:
      return { int: pitch, accidental: Accidental.Sharp };
  }
}

/** Returns pitch parts [letter, accidental, octave] */
export function pitchToParts(pitch: Pitch): [string, Accidental, number] {
  const LETTERS: { [key: number]: string } = {
    0: "C",
    2: "D",
    4: "E",
    5: "F",
    7: "G",
    9: "A",
    11: "B",
  };

  const octave = Math.floor((pitch.int - pitch.accidental - C0) / 12);
  const letter = LETTERS[(pitch.int - pitch.accidental - C0) % 12];
  return [letter, pitch.accidental, octave];
}

/** returns the visual distance between to tones */
export function getStepsBetweenPitches(pitchA: Pitch, pitchB: Pitch) {
  const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
  const [pitchANote, _accidentalA, pitchAOctave] = pitchToParts(pitchA);
  const [pitchBNote, _accidentalB, pitchBOctave] = pitchToParts(pitchB);
  const octaveOffset = (pitchBOctave - pitchAOctave) * 7;
  return octaveOffset + LETTERS.indexOf(pitchBNote) - LETTERS.indexOf(pitchANote);
}
