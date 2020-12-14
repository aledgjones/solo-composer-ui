import { NotationTrack, getNearestNotationToTick } from "./notation-track";

/**
 * Split the notation track at split points
 *
 * NB. You can safely pass in a split point at the begining of a note -- it will be ignored
 */
export function splitNotationTrack(track: NotationTrack, split: number): NotationTrack {
  const event = getNearestNotationToTick(split, track);

  // check for undefined event and only split if:
  // 1. split index not already the start of an event.
  // 2. split index is not the end of an event (ie; end of flow);
  if (event && event.at !== split && split !== event.at + event.entry.duration) {
    track[event.at] = {
      duration: split - event.at,
      tones: [...event.entry.tones],
      ties: event.entry.tones.map((tone) => tone.key),
    };

    track[split] = {
      duration: event.at + event.entry.duration - split,
      tones: [...event.entry.tones],
      ties: [...event.entry.ties],
    };
  }

  return track;
}
