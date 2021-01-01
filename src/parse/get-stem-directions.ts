import { BeamsByTrack } from "./get-beams";
import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { Notation, NotationTrack, NotationTracks } from "./notation-track";

export enum StemDirectionType {
  Up = 1,
  Down = -1,
}

export type StemDirections = Map<number, StemDirectionType>;

export interface StemDirectionsByTrack {
  [trackKey: string]: StemDirections;
}

export function getStemDirection(entry: Notation, toneVerticalOffsets: ToneVerticalOffsets) {
  const offsets = entry.tones.map((tone) => toneVerticalOffsets.get(tone.key));
  const min = Math.min(...offsets);
  const max = Math.max(...offsets);

  // equal distance high and low BUT NOT unison or single note
  if (min !== max && Math.abs(min) === Math.abs(max)) {
    return StemDirectionType.Down;
  }

  const farthest = Math.abs(min) > Math.abs(max) ? min : max;
  if (farthest > 0) {
    return StemDirectionType.Up;
  } else {
    return StemDirectionType.Down;
  }
}

export function getStemDirectionsInTrack(
  track: NotationTrack,
  toneVerticalOffsets: ToneVerticalOffsets,
  beams: Set<number[]>
) {
  const stemDirections: StemDirections = new Map();

  // get the natural stem directions
  const ticks = Object.keys(track).map((k) => parseInt(k));
  ticks.forEach((tick) => {
    const entry = track[tick];
    if (entry.tones.length > 0) {
      stemDirections.set(tick, getStemDirection(entry, toneVerticalOffsets));
    }
  });

  // adapt stem directions based on beams
  // - most in the right direction
  // - even number up/down
  //   - furthest takes precedent
  //   - otherwise down
  beams.forEach((group) => {
    const directions = group.map((tick) => {
      return stemDirections.get(tick);
    });
    // count how many up/down
    const [upCount, downCount] = directions.reduce(
      (out, entry) => {
        out[entry === StemDirectionType.Up ? 0 : 1]++;
        return out;
      },
      [0, 0]
    );

    // we go for whichever is the most...
    if (upCount > downCount) {
      group.forEach((tick) => {
        stemDirections.set(tick, StemDirectionType.Up);
      });
    } else if (downCount > upCount) {
      group.forEach((tick) => {
        stemDirections.set(tick, StemDirectionType.Down);
      });
    } else {
      // ...if equal number of up/down we go for the furthest from the center
      let farthest = 0;
      group.forEach((tick) => {
        track[tick].tones.forEach((tone) => {
          const offset = toneVerticalOffsets.get(tone.key);
          if (Math.abs(offset) > Math.abs(farthest)) {
            farthest = offset;
          } else if (Math.abs(offset) === Math.abs(farthest) && offset < 0) {
            // if the same distance, prioritise the down stem.
            farthest = offset;
          }
        });
      });
      if (farthest > 0) {
        group.forEach((tick) => {
          stemDirections.set(tick, StemDirectionType.Up);
        });
      } else {
        group.forEach((tick) => {
          stemDirections.set(tick, StemDirectionType.Down);
        });
      }
    }
  });

  // TODO: notes far exceding the disance of the rest of the notes are ignored (what is too far?)
  // TODO: adapt middle based on context

  return stemDirections;
}

export function getStemDirections(
  notation: NotationTracks,
  toneVerticalOffsets: ToneVerticalOffsets,
  beams: BeamsByTrack
) {
  let directions: StemDirectionsByTrack = {};
  const keys = Object.keys(notation);
  keys.forEach((trackKey) => {
    const track = notation[trackKey];
    directions[trackKey] = getStemDirectionsInTrack(track, toneVerticalOffsets, beams[trackKey]);
  });
  return directions;
}
