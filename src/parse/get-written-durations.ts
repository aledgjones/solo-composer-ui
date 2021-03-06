import { Flow } from "../store/score-flow/defs";
import { NotationTracks } from "./notation-track";
import { splitAtToneEvents } from "./split-at-tone-events";
import { splitAsPerMeter } from "./split-as-per-meter";
import { Stave } from "../store/score-stave/defs";
import { Barlines } from "./get-barlines";

/**
 * Convert tones into written notation values
 */
export function getWrittenDurations(staves: Stave[], flow: Flow, barlines: Barlines) {
  const out: NotationTracks = {};

  for (let i = 0; i < staves.length; i++) {
    const stave = staves[i];
    stave.tracks.order.forEach((track_key) => {
      const track = stave.tracks.by_key[track_key];
      const notation = splitAtToneEvents(flow.length, track);
      out[track_key] = splitAsPerMeter(flow, notation, barlines);
    }, {});
  }

  return out;
}
