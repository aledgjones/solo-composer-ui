import { Track } from "./defs";
import { Entry } from "../entries";
import shortid from "shortid";

export function create_track(key: string = shortid()): Track {
    return {
        key,
        entries: { by_key: {}, by_tick: {} },
    };
}

/** Insert an entry into the track */
export function insert_entry(
    track: Track,
    entry: Entry,
    only_one_allowed?: boolean
) {
    // if only one of this type of entry is allowed, we delete any others of the same type
    if (only_one_allowed) {
        const old = track.entries.by_tick[entry.tick]
            .map((key) => track.entries.by_key[key])
            .filter((e) => {
                return e.type === entry.type;
            })[0];

        if (old) {
            remove_entry(track, old.key);
        }
    }
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
        if (track.entries.by_tick[entry.tick].length === 0) {
            delete track.entries.by_tick[entry.tick];
        }

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
    if (track.entries.by_tick[entry.tick].length === 0) {
        delete track.entries.by_tick[entry.tick];
    }
    delete track.entries.by_key[entry_key];
}
