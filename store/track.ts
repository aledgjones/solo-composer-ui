import shortid from "shortid";
import { Track, Entry } from "./defs";

export function create_empty_track(key: string = shortid()): Track {
    return {
        key,
        entries: { by_key: {}, by_tick: {} },
    };
}

/** Insert an entry into the track */
export function insert_entry(track: Track, entry: Entry) {
    track.entries.by_key[entry.key] = entry;
    if (track.entries.by_tick[entry.tick] === undefined) {
        track.entries.by_tick[entry.tick] = [];
    }
    track.entries.by_tick[entry.tick].push(entry.key);
}

/** Move an entry to a new tick of the track */
export function move_entry(track: Track, entry_key: string, tick: number) {
    const entry = track.entries.by_key[entry_key];
    if (tick !== entry.tick) {
        // remove from previous tick entry and cleanup
        track.entries.by_tick[entry.tick] = track.entries.by_tick[
            entry.tick
        ].filter((k) => k !== entry_key);
        track.entries.by_tick[entry.tick].length === 0;
        delete track.entries.by_tick[entry.tick];

        // create a new tick entry if not present
        if (track.entries.by_tick[tick] === undefined) {
            track.entries.by_tick[tick] = [];
        }
        track.entries.by_tick[tick].push(entry_key);

        // update the actual entry
        entry.tick = tick;
    }
}

/** Remove the entry from the track */
export function remove_entry(track: Track, entry_key: string) {
    const entry = track.entries.by_key[entry_key];
    track.entries.by_tick[entry.tick] = track.entries.by_tick[
        entry.tick
    ].filter((k) => k !== entry_key);
    track.entries.by_tick[entry.tick].length === 0;
    delete track.entries.by_tick[entry.tick];
    delete track.entries.by_key[entry_key];
}
