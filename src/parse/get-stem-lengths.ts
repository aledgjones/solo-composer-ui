import { Stave } from "../store/score-stave/defs";
import { StemDirections, StemDirectionsByTrack, StemDirectionType } from "./get-stem-directions";
import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { getBaseDuration, Notation, NotationTrack, NotationTracks } from "./notation-track";
import { Flow } from "../store/score-flow/defs";
import { Beams, BeamsByTrack } from "./get-beams";

export type StemLengths = Map<number, { head: number; tail: number }>;

export interface StemLengthsByTrack {
  [trackKey: string]: StemLengths;
}

export function getStemLength(entry: Notation, toneVerticalOffsets: ToneVerticalOffsets, direction: StemDirectionType) {
  const offsets = entry.tones.map((tone) => toneVerticalOffsets.get(tone.key));
  const max = Math.max(...offsets);
  const min = Math.min(...offsets);

  const head = (direction === StemDirectionType.Up ? max - 0.5 : min + 0.5) / 2;
  const chordHeight = max - min;
  const length = Math.max(
    chordHeight / 2 + 3.25,
    Math.abs((direction === StemDirectionType.Up ? max - 0.5 : min + 0.5) / 2)
  );

  return { head, tail: head + (direction === StemDirectionType.Up ? -length : length) };
}

function getStemLengthsInTrack(
  flow: Flow,
  track: NotationTrack,
  directions: StemDirections,
  toneVerticalOffsets: ToneVerticalOffsets,
  beams: Beams
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

  // TODO beams affect lengths -- temporarily just make stems uniform
  // beams.forEach((group) => {
  //   let longest = lengths.get(group[0]).tail;
  //   group.forEach((tick) => {
  //     const offset = lengths.get(tick);
  //     if (directions.get(tick) === StemDirectionType.Up ? offset.tail < longest : offset.tail > longest) {
  //       longest = offset.tail;
  //     }
  //   });
  //   group.forEach((tick) => {
  //     const entry = lengths.get(tick);
  //     lengths.set(tick, { head: entry.head, tail: longest });
  //   });
  // });

  return lengths;
}

export function getStemLengths(
  flow: Flow,
  staves: Stave[],
  notation: NotationTracks,
  toneVerticalOffsets: ToneVerticalOffsets,
  stemDirections: StemDirectionsByTrack,
  beamings: BeamsByTrack
) {
  const lengths: StemLengthsByTrack = {};

  staves.forEach((stave) => {
    stave.tracks.order.forEach((trackKey) => {
      const track = notation[trackKey];
      const directions = stemDirections[trackKey];
      const beams = beamings[trackKey];
      lengths[trackKey] = getStemLengthsInTrack(flow, track, directions, toneVerticalOffsets, beams);
    });
  });

  return lengths;
}
