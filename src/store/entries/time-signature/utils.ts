import shortid from "shortid";
import { NoteDuration, EntryType, Entry, Box } from "..";
import { TimeSignatureDrawType, TimeSignature, TimeSignatureType } from "./defs";
import { Track } from "../../score-track/defs";

export function measureTimeSignatureBox(entry: TimeSignature): Box {
    const isHidden = entry.draw_type === TimeSignatureDrawType.Hidden;
    return { width: isHidden ? 0 : 1.75, height: 4 };
}

export function measureTimeSignatureBounds(entry: TimeSignature): Box {
    const isHidden = entry.draw_type === TimeSignatureDrawType.Hidden;
    return { width: isHidden ? 0 : 1.75 + 1.5, height: 4 };
}

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

export function duration_to_ticks(duration: NoteDuration, subdivisions: number) {
    switch (duration) {
        case NoteDuration.Whole:
            return subdivisions * 4;
        case NoteDuration.Half:
            return subdivisions * 2;
        case NoteDuration.Quarter:
            return subdivisions;
        case NoteDuration.Eighth:
            return subdivisions / 2;
        case NoteDuration.Sixteenth:
            return subdivisions / 4;
        case NoteDuration.ThirtySecond:
            return subdivisions / 8;
        default:
            return subdivisions;
    }
}

export function distance_from_barline(tick: number, subdivisions: number, time_signature: TimeSignature) {
    if (kind_from_beats(time_signature.beats) === TimeSignatureType.Open) {
        return tick - time_signature.tick;
    } else {
        const ticks_per_bar = duration_to_ticks(time_signature.beat_type, subdivisions) * time_signature.beats;
        return (tick - time_signature.tick) % ticks_per_bar;
    }
}

export function is_on_beat_type(
    tick: number,
    subdivisions: number,
    time_signature: TimeSignature,
    beat_type: NoteDuration
) {
    if (kind_from_beats(time_signature.beats) === TimeSignatureType.Open) {
        return tick === time_signature.tick;
    } else {
        const ticks_per_beat_type = duration_to_ticks(beat_type, subdivisions);
        return (tick - time_signature.tick) % ticks_per_beat_type === 0;
    }
}

export function is_on_grouping_boundry(tick: number, subdivisions: number, time_signature: TimeSignature) {
    if (kind_from_beats(time_signature.beats) === TimeSignatureType.Open) {
        return tick === time_signature.tick;
    } else {
        let ticks_per_beat = duration_to_ticks(time_signature.beat_type, subdivisions);
        let bar_length = ticks_per_beat * time_signature.beats;
        let distance_from_first_beat = (tick - time_signature.tick) % bar_length;

        if (distance_from_first_beat === 0) {
            return true;
        }

        let offset = 0;
        time_signature.groupings.forEach((group) => {
            offset += group * ticks_per_beat;
            if (distance_from_first_beat == offset) {
                return true;
            }
        });

        return false;
    }
}

export function get_entries_at_tick(tick: number, track: Track, type: EntryType) {
    const entries = track.entries.by_tick[tick] || [];
    return entries.map((key) => track.entries.by_key[key]).filter((entry) => entry.type === type);
}

export function get_entry_after_tick(tick: number, track: Track, type: EntryType) {
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
