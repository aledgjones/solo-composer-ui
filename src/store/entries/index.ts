export enum EntryType {
    TimeSignature,
    AbsoluteTempo,
    Clef,
    Tone,
}

export interface Entry {
    key: string;
    tick: number;
    type: EntryType;
}

export enum NoteDuration {
    Whole,
    Half,
    Quarter,
    Eighth,
    Sixteenth,
    ThirtySecond,
}

export enum DottedValue {
    None,
    Single,
    Double,
}

export enum Articulation {
    None,
    Staccato,
    Staccatissimo,
    Tenuto,
    StaccatoTenuto,
}

export enum Accidental {
    DoubleSharp = 2,
    Sharp = 1,
    Natural = 0,
    Flat = -1,
    DoubleFlat = -2,
}

export interface Pitch {
    int: number;
    accidental: Accidental;
}

/**
 * Converts a int value to a full pitch with appropriate accidental
 * // TODO: Make this more sophisticated
 */
export function pitch_from_number(pitch: number): Pitch {
    let step = pitch % 12;
    switch (step) {
        case 0:
        case 2:
        case 4:
        case 5:
        case 7:
        case 9:
        case 10:
            return { int: pitch, accidental: Accidental.Natural };
        default:
            return { int: pitch, accidental: Accidental.Sharp };
    }
}
