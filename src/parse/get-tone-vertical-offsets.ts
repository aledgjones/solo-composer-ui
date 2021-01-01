import { Clef } from "../store/entries/clef/defs";
import { EntryType } from "../store/entries/defs";
import { get_entries_at_tick, get_entry_before_tick } from "../store/entries/time-signature/utils";
import { Tone } from "../store/entries/tone/defs";
import { getStepsBetweenPitches } from "../store/entries/utils";
import { Stave } from "../store/score-stave/defs";

export type ToneVerticalOffsets = Map<string, number>;

export function getToneVerticalOffsets(staves: Stave[]) {
  const offsets: ToneVerticalOffsets = new Map();

  staves.forEach((stave) => {
    stave.tracks.order.forEach((trackKey) => {
      const track = stave.tracks.by_key[trackKey];
      const ticks = Object.keys(track.entries.by_tick).map((k) => parseInt(k));
      ticks.forEach((tick) => {
        const clef = get_entry_before_tick(tick, stave.master, EntryType.Clef, true) as Clef;
        const tones = get_entries_at_tick(tick, track, EntryType.Tone) as Tone[];
        tones.forEach((tone) => {
          offsets.set(tone.key, clef.offset * -1 - getStepsBetweenPitches(clef.pitch, tone.pitch));
        });
      });
    });
  });

  return offsets;
}
