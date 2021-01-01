import { duration_to_ticks } from "../store/entries/time-signature/utils";
import { Flow } from "../store/score-flow/defs";
import { NotationTrack, NotationTracks } from "./notation-track";
import { getBeatGroupingBoundries } from "./get-beat-group-boundries";
import { getIsBeamable } from "./get-is-beamable";
import { Barlines } from "./get-barlines";

export type Beams = Set<number[]>;
export interface BeamsByTrack {
  [trackKey: string]: Beams;
}

export function getBeamsInTrack(flow: Flow, track: NotationTrack, barlines: Barlines) {
  let time, boundries;
  let spans: number[][] = [[]];
  for (let tick = 0; tick < flow.length; tick++) {
    if (barlines.has(tick)) {
      time = barlines.get(tick);
      const ticksPerBeat = duration_to_ticks(time.beat_type, flow.subdivisions);
      boundries = getBeatGroupingBoundries(tick, ticksPerBeat, time.groupings);
    }

    if (boundries.includes(tick)) {
      spans.push([]);
    }

    const entry = track[tick];
    if (entry) {
      const isBeamable = getIsBeamable(entry.duration, flow.subdivisions);
      if (entry.tones.length > 0 && isBeamable) {
        spans[spans.length - 1].push(tick);
      } else {
        spans.push([]);
      }
    }
  }

  const beams = new Set<number[]>();
  spans.forEach((span) => {
    if (span.length > 1) {
      beams.add(span);
    }
  });
  return beams;
}

export function getBeams(flow: Flow, notation: NotationTracks, barlines: Barlines) {
  let beams: BeamsByTrack = {};
  const keys = Object.keys(notation);
  keys.forEach((trackKey) => {
    const track = notation[trackKey];
    beams[trackKey] = getBeamsInTrack(flow, track, barlines);
  });
  return beams;
}
