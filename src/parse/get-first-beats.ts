import { Flow } from "../store/score-flow/defs";
import { get_entries_at_tick, distance_from_barline } from "../store/entries/time-signature/utils";
import { EntryType } from "../store/entries/defs";
import { TimeSignature } from "../store/entries/time-signature/defs";

/**
 * Gets the first beats as number[] where number is tick index
 *
 * returns number[] as this is most useful for splitting into bars
 */
export function getFirstBeats(flow: Flow) {
  const ticks: Set<number> = new Set();
  let time_signature: TimeSignature;

  for (let tick = 0; tick < flow.length; tick++) {
    const result = get_entries_at_tick(tick, flow.master, EntryType.TimeSignature);
    if (result[0]) {
      time_signature = result[0] as TimeSignature;
    }

    if (distance_from_barline(tick, flow.subdivisions, time_signature) === 0) {
      ticks.add(tick);
    }
  }

  return ticks;
}
