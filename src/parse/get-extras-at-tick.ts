import { Flow } from "../store/score-flow/defs";
import { Barline } from "../store/entries/barline/defs";
import { get_entries_at_tick } from "../store/entries/time-signature/utils";
import { EntryType } from "../store/entries/defs";
import { TimeSignature } from "../store/entries/time-signature/defs";
import { KeySignature } from "../store/entries/key-signature/defs";

export function getextrasAtTick(tick: number, flow: Flow) {
  const time = get_entries_at_tick(tick, flow.master, EntryType.TimeSignature)[0] as TimeSignature;
  const key = get_entries_at_tick(tick, flow.master, EntryType.KeySignature)[0] as KeySignature;
  const barline = get_entries_at_tick(tick, flow.master, EntryType.Barline)[0] as Barline;
  return { time, key, barline };
}
