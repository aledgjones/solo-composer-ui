import shortid from "shortid";
import { Flow, NoteDuration, TimeSignatureDrawType } from "./defs";
import { create_time_signature } from "./entries";
import { create_empty_track, insert_entry } from "./track";

export function create_flow(): Flow {
    const time_signature = create_time_signature(
        0,
        4,
        NoteDuration.Quarter,
        TimeSignatureDrawType.Normal
    );
    const master = create_empty_track();
    insert_entry(master, time_signature);
    return {
        key: shortid(),
        title: "",
        players: [],
        length: 16 * 4 * 4,
        subdivisions: 16,

        master,
        staves: {},
    };
}
