import { Flow } from "../store/score-flow/defs";
import { NotationTracks } from "./notation-track";
import { Player } from "../store/score-player/defs";
import { Instrument } from "../store/score-instrument/defs";
import { splitAtToneEvents } from "./split-at-tone-events";
import { splitAsPerMeter } from "./split-as-per-meter";
import { Stave } from "../store/score-stave/defs";
import { Track } from "../store/score-track/defs";

/**
 * Convert tones into written notation values
 */
export function getWrittenDurations(staves: Stave[], flow: Flow, barlines: Set<number>) {
  return staves.reduce<NotationTracks>((output, stave) => {
    stave.tracks.order.forEach((track_key) => {
      const track = stave.tracks.by_key[track_key];
      const notation = splitAtToneEvents(flow.length, track);
      output[track_key] = splitAsPerMeter(flow, notation, barlines);
    }, {});
    return output;
  }, {});
}
