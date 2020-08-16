import shortid from "shortid";
import { ClefDrawType, Accidental, Clef, EntryType } from "./defs";

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
