import shortid from "shortid";
import { AbsoluteTempo, NoteDuration, DottedValue, EntryType } from "../defs";

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
            return 0;
    }
}

export function normalize_bpm(time_signature: AbsoluteTempo): number {
    let base = 1;
    switch (time_signature.beat_type) {
        case NoteDuration.Whole:
            base = 4;
            break;
        case NoteDuration.Half:
            base = 2;
            break;
        case NoteDuration.Quarter:
            base = 1;
            break;
        case NoteDuration.Eighth:
            base = 0.5;
            break;
        case NoteDuration.Sixteenth:
            base = 0.25;
            break;
        case NoteDuration.ThirtySecond:
            base = 0.125;
            break;
        default:
            base = 1;
            break;
    }
    const duration = base + calculate_dot(base, time_signature.dotted);
    return time_signature.bpm * duration;
}
