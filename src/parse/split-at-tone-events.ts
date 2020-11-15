import { Track } from "../store/score-track/defs";
import { NotationTrack } from "./notation-track";
import { EntryType } from "../store/entries";
import { splitNotationTrack } from "./split-notation-track";
import { Tone } from "../store/entries/tone/defs";

/**
 *  split tones at other tone events if they overlap.
 *
 *  ie. we split notation on the on / off of new notes while other, longer notes are playing
 */
export function splitAtToneEvents(length: number, track: Track): NotationTrack {
  // we start with a complete track of rests
  const output: NotationTrack = {
    [0]: {
      tones: [],
      duration: length,
      ties: [],
    },
  };

  // walk through all the tones splitting the rest filled track at tone start & stop
  for (let tick = 0; tick <= length; tick++) {
    const entries = track.entries.by_tick[tick] || [];
    entries.forEach((entry_key) => {
      const entry = track.entries.by_key[entry_key];
      if (entry.type === EntryType.Tone) {
        const tone = entry as Tone;
        splitNotationTrack(output, tick);
        splitNotationTrack(output, tick + tone.duration);
      }
    });
  }

  // fill the split track with the tone entries
  for (let tick = 0; tick <= length; tick++) {
    const entries = track.entries.by_tick[tick] || [];
    entries.forEach((entry_key) => {
      const entry = track.entries.by_key[entry_key];
      if (entry.type === EntryType.Tone) {
        const tone = entry as Tone;

        let look_ahead = tick;
        while (tone.duration > look_ahead - tick) {
          const remainder = tone.duration - (look_ahead - tick);
          output[look_ahead].tones.push(tone);
          if (output[look_ahead].duration < remainder) {
            output[look_ahead].ties.push(tone.key);
          }
          look_ahead += output[look_ahead].duration;
        }
      }
    });
  }

  return output;
}
