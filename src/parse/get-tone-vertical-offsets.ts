import { Clef } from "../store/entries/clef/defs";
import { EntryType } from "../store/entries/defs";
import { get_entries_at_tick, get_entry_before_tick } from "../store/entries/time-signature/utils";
import { Tone } from "../store/entries/tone/defs";
import { getStepsBetweenPitches } from "../store/entries/utils";
import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";

export type ToneVerticalOffsets = Map<string, number>;

export function getToneVerticalOffsets(flow: Flow, staves: Stave[]) {
  const offsets: ToneVerticalOffsets = new Map();

  staves.forEach((stave) => {
    let clef: Clef = null;
    for (let tick = 0; tick < flow.length; tick++) {
      const result = get_entries_at_tick(tick, stave.master, EntryType.Clef);
      if (result.length > 0) {
        clef = result[0] as Clef;
      }

      stave.tracks.order.forEach((trackKey) => {
        const track = stave.tracks.by_key[trackKey];
        const tones = get_entries_at_tick(tick, track, EntryType.Tone) as Tone[];
        if (tones.length > 0) {
          tones.forEach((tone) => {
            offsets.set(tone.key, clef.offset * -1 - getStepsBetweenPitches(clef.pitch, tone.pitch));
          });
        }
      });
    }
  });

  return offsets;
}
