import { Clef } from "../store/entries/clef/defs";
import { EntryType } from "../store/entries/defs";
import { get_entries_at_tick, get_entry_before_tick } from "../store/entries/time-signature/utils";
import { Tone } from "../store/entries/tone/defs";
import { getStepsBetweenPitches } from "../store/entries/utils";
import { Stave } from "../store/score-stave/defs";

export type ToneVerticalOffsets = Map<string, number>;

export function getToneVerticalOffsets(staves: Stave[]) {
  const offsets: ToneVerticalOffsets = new Map();

  for (let i = 0; i < staves.length; i++) {
    const stave = staves[i];

    for (let ii = 0; ii < stave.tracks.order.length; ii++) {
      const trackKey = stave.tracks.order[ii];
      const track = stave.tracks.by_key[trackKey];
      const ticks = Object.keys(track.entries.by_tick).map((k) => parseInt(k));

      for (let iii = 0; iii < ticks.length; iii++) {
        const tick = ticks[iii];
        const clef = get_entry_before_tick(tick, stave.master, EntryType.Clef, true) as Clef;
        const tones = get_entries_at_tick(tick, track, EntryType.Tone) as Tone[];

        for (let iiii = 0; iiii < tones.length; iiii++) {
          const tone = tones[iiii];
          offsets.set(tone.key, clef.offset * -1 - getStepsBetweenPitches(clef.pitch, tone.pitch));
        }
      }
    }
  }

  return offsets;
}
