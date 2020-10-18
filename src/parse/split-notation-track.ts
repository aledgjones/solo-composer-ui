import { NotationTrack, getNearestNotationToTick } from "./notation-track";

/**
 * Split the notation track at split points
 *
 * NB. You can safely pass in a split point at the begining of a note -- it will be ignored
 */
export function splitNotationTrack(
    track: NotationTrack,
    split: number
): NotationTrack {
    const event = getNearestNotationToTick(split, track);

    // check for undefined event and only split if split index it's not already the start of an event.
    if (event && event.at !== split) {
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
