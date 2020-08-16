import shortid from "shortid";
import {
    NoteDuration,
    EntryType,
    TimeSignature,
    TimeSignatureDrawType,
    Track,
    Entry,
} from "./defs";

/** Create a time signature with optional beat groupings */
export function create_time_signature(
    tick: number,
    beats: number,
    beat_type: NoteDuration,
    draw_type: TimeSignatureDrawType,
    groupings?: number[]
): TimeSignature {
    return {
        key: shortid(),
        tick,
        type: EntryType.TimeSignature,
        beats,
        beat_type,
        draw_type,
        groupings: groupings || default_groupings(beats),
    };
}

export enum TimeSignatureType {
    Simple,
    Compound,
    Complex,
    Open,
}

export function kind_from_beats(beats: number): TimeSignatureType {
    if (beats == 0) {
        return TimeSignatureType.Open;
    } else if (beats > 3 && beats % 3 == 0) {
        return TimeSignatureType.Compound;
    } else if (beats == 1 || beats == 2 || beats == 3 || beats == 4) {
        return TimeSignatureType.Simple;
    } else {
        return TimeSignatureType.Complex;
    }
}

function default_groupings(beats: number): number[] {
    if (beats > 0 && beats <= 3) {
        return Array(beats).fill(1);
    } else {
        switch (kind_from_beats(beats)) {
            case TimeSignatureType.Simple:
                return Array(beats / 2).fill(2);
            case TimeSignatureType.Compound:
                return Array(beats / 3).fill(3);
            case TimeSignatureType.Complex: {
                const out = [];
                let remaining = beats;
                while (remaining > 4) {
                    out.push(3);
                    remaining = remaining - 3;
                }
                out.push(remaining);
                return out;
            }
            case TimeSignatureType.Open:
                return [];
        }
    }
}

export function get_entries_at_tick(
    tick: number,
    track: Track,
    type: EntryType
) {
    const entries = track.entries.by_tick[tick] || [];
    return entries
        .map((key) => track.entries.by_key[key])
        .filter((entry) => entry.type === type);
}

export function get_entry_after_tick(
    tick: number,
    track: Track,
    type: EntryType
) {
    let found: Entry = null;
    const entries = Object.values(track.entries.by_key);
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (entry.type === type && entry.tick > tick) {
            if (!found || found.tick > entry.tick) {
                found = entry;
            }
        }
    }

    return found;
}
