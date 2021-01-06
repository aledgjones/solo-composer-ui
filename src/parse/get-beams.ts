import { duration_to_ticks } from "../store/entries/time-signature/utils";
import { Flow } from "../store/score-flow/defs";
import { NotationTrack, NotationTracks } from "./notation-track";
import { getBeatGroupingBoundries } from "./get-beat-group-boundries";
import { getIsBeamable } from "./get-is-beamable";
import { Barlines } from "./get-barlines";
import { TimeSignature } from "../store/entries/time-signature/defs";
import { NoteDuration } from "../store/entries/defs";

export type Beams = Set<number[]>;
export interface BeamsByTrack {
  [trackKey: string]: Beams;
}

function getHasSixteenthsOrSmaller(flow: Flow, tick: number, boundries: number[], track: NotationTrack) {
  const sixteenth = duration_to_ticks(NoteDuration.Sixteenth, flow.subdivisions);

  let start = tick;
  let stop = flow.length;

  for (let i = tick + 1; i < flow.length; i++) {
    if (boundries.indexOf(i) > -1) {
      stop = i;
      break;
    }
  }

  for (let i = start; i < stop; i++) {
    const entry = track[i];
    if (entry && entry.duration <= sixteenth) {
      return true;
    }
  }

  return false;
}

export function getBeamsInTrack(flow: Flow, track: NotationTrack, barlines: Barlines) {
  const spans: number[][] = [];
  let time: TimeSignature, ticksPerBeat: number, boundries: number[], hasSixteenthsOrLess: boolean;

  for (let tick = 0; tick < flow.length; tick++) {
    if (barlines.has(tick)) {
      time = barlines.get(tick);
      ticksPerBeat = duration_to_ticks(time.beat_type, flow.subdivisions);
      boundries = getBeatGroupingBoundries(tick, ticksPerBeat, time.groupings);
    }

    if (boundries.includes(tick)) {
      hasSixteenthsOrLess = getHasSixteenthsOrSmaller(flow, tick, boundries, track);
    }

    if (boundries.includes(tick)) {
      spans.push([]);
    }

    if (
      time.beat_type === NoteDuration.Quarter && // quarter time sigs only
      hasSixteenthsOrLess && // if sixtens or less
      (tick - time.tick) % ticksPerBeat === 0 // split at beats
    ) {
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
