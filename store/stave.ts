import { Stave, StaveDef } from "./defs";
import { create_clef } from "./clef";
import { create_empty_track, insert_entry } from "./track";

export function create_empty_stave(key: string, staveDef: StaveDef): Stave {
    const clef = create_clef(
        0,
        staveDef.clef.pitch,
        staveDef.clef.offset,
        staveDef.clef.draw_as
    );
    const master = create_empty_track();
    insert_entry(master, clef);

    const primary = create_empty_track();

    return {
        key,
        lines: staveDef.lines,
        master,
        tracks: {
            order: [primary.key],
            by_key: {
                [primary.key]: primary,
            },
        },
    };
}
