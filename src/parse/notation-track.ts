import { NoteDuration } from "../store/entries/defs";
import { Tone } from "../store/entries/tone/defs";

export enum NotationBaseDuration {
  ThirtySecond = 0.125,
  Sixteenth = 0.25,
  Eighth = 0.5,
  Quarter = 1,
  Half = 2,
  Whole = 4,
}

export interface Notation {
  tones: Tone[]; // these may be repeated if a tone is split up into ties notes
  duration: number;
  ties: string[];
}

export interface NotationTrack {
  [tick: number]: Notation;
}

export interface NotationTracks {
  [trackKey: string]: NotationTrack;
}

export function getNearestNotationToTick(
  _tick: number,
  track: NotationTrack
): { at: number; entry: Notation } | undefined {
  for (let tick = _tick; tick >= 0; tick--) {
    const entry = track[tick];
    if (entry) {
      return {
        at: tick,
        entry: entry,
      };
    }
  }
}

export function getBaseDuration(duration: number, subdivisions: number): NoteDuration {
  const length = duration / subdivisions;
  switch (length) {
    case 0.125:
      return NoteDuration.ThirtySecond;
    case 0.25:
      return NoteDuration.Sixteenth;
    case 0.5:
      return NoteDuration.Eighth;
    case 1:
      return NoteDuration.Quarter;
    case 2:
      return NoteDuration.Half;
    case 4:
      return NoteDuration.Whole;

    default:
      const baseLength = (duration / 3) * 2;
      return getBaseDuration(baseLength, subdivisions);
  }
}

export function getIsDotted(duration: number, subdivisions: number): boolean {
  const length = duration / subdivisions;
  if (NotationBaseDuration[length]) {
    return false;
  } else {
    const baseLength = (length / 3) * 2;
    if (NotationBaseDuration[baseLength]) {
      return true;
    } else {
      return false;
    }
  }
}
