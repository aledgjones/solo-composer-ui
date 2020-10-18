import { AbsoluteTempo } from "./defs";
import { NoteDuration, DottedValue, EntryType } from "..";
import shortid from "shortid";

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
