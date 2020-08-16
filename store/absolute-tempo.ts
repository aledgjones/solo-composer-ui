import shortid from "shortid";
import { AbsoluteTempo, NoteDuration, DottedValue, EntryType } from "./defs";

export function create_absolute_tempo(
    tick: number,
    text: string,
    beat_type: NoteDuration,
    dotted: DottedValue,
    bpm: number,
    parenthesis_visible: boolean,
    text_visible: boolean,
    bpm_visible: boolean
): AbsoluteTempo {
    return {
        key: shortid(),
        tick,
        type: EntryType.AbsoluteTempo,
        text,
        beat_type,
        dotted,
        bpm,
        parenthesis_visible,
        text_visible,
        bpm_visible,
    };
}

function beat_to_ticks(subdivisions: number, beat_type: NoteDuration) {
    switch (beat_type) {
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

function calculate_dot(duration: number, dotted: DottedValue) {
    switch (dotted) {
        case DottedValue.Single:
            return duration / 2;
        case DottedValue.Double:
            return duration / 2 + duration / 4;
        default:
            return duration;
    }
}

export function normalize_bpm(
    subdivisions: number,
    beat_type: NoteDuration,
    dotted: DottedValue,
    bpm: number
): number {
    const base_duration = beat_to_ticks(subdivisions, beat_type);
    const duration = base_duration + calculate_dot(base_duration, dotted);
    return bpm * (duration / subdivisions);
}
