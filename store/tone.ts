import shortid from "shortid";
import { Pitch, Articulation, Tone, EntryType } from "./defs";

export function create_tone(
    tick: number,
    duration: number,
    pitch: Pitch,
    velocity: number,
    articulation: Articulation,
    key: string = shortid()
): Tone {
    return {
        key,
        tick,
        type: EntryType.Tone,
        duration,
        pitch,
        velocity,
        articulation,
    };
}
