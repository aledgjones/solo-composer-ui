import { Stave } from "../store/score-stave/defs";
import { StemDirections, StemDirectionsByTrack, StemDirectionType } from "./get-stem-directions";
import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { getBaseDuration, Notation, NotationTrack, NotationTracks } from "./notation-track";
import { Flow } from "../store/score-flow/defs";

export type StemLengths = Map<number, { offset: number; length: number }>;

export interface StemLengthsByTrack {
  [trackKey: string]: StemLengths;
}

export function getStemLength(entry: Notation, toneVerticalOffsets: ToneVerticalOffsets, direction: StemDirectionType) {
  const offsets = entry.tones.map((tone) => toneVerticalOffsets[tone.key]);
  const max = Math.max(...offsets);
  const min = Math.min(...offsets);

  const offset = (direction === StemDirectionType.Up ? max - 0.5 : min + 0.5) / 2;
  const length = Math.max(3.25, Math.abs((direction === StemDirectionType.Up ? max - 0.5 : min + 0.5) / 2));

  return { offset, length };
}

function getStemLengthsInTrack(
  flow: Flow,
  track: NotationTrack,
  directions: StemDirections,
  toneVerticalOffsets: ToneVerticalOffsets
) {
  const lengths: StemLengths = new Map();

  // get natural lengths
  directions.forEach((direction, tick) => {
    const entry = track[tick];
    // only draw stems if duration < whole
    if (getBaseDuration(entry.duration, flow.subdivisions) > 1) {
      lengths.set(tick, getStemLength(entry, toneVerticalOffsets, direction));
    }
  });

  // TODO beams affect lengths

  return lengths;
}

export function getStemLengths(
  flow: Flow,
  staves: Stave[],
  notation: NotationTracks,
  toneVerticalOffsets: ToneVerticalOffsets,
  stemDirections: StemDirectionsByTrack
) {
  const lengths: StemLengthsByTrack = {};

  staves.forEach((stave) => {
    stave.tracks.order.forEach((trackKey) => {
      const track = notation[trackKey];
      const directions = stemDirections[trackKey];
      lengths[trackKey] = getStemLengthsInTrack(flow, track, directions, toneVerticalOffsets);
    });
  });

  return lengths;
}
