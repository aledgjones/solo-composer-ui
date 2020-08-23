import shortid from "shortid";
import { Entry, EntryType, Accidental, Pitch } from ".";

export enum ClefDrawType {
    Hidden,
    G,
    F,
    C,
    Percussion,
}

export interface Clef extends Entry {
    type: EntryType.Clef;
    draw_as: ClefDrawType;
    pitch: Pitch; // the pitch that the clef sits on
    offset: number; // visual offset from top stave line
}

export function create_clef(
    tick: number,
    pitch: number,
    offset: number,
    draw_as: ClefDrawType,
    key: string = shortid()
): Clef {
    return {
        key,
        tick,
        type: EntryType.Clef,
        pitch: {
            int: pitch,
            accidental: Accidental.Natural,
        },
        offset,
        draw_as,
    };
}
