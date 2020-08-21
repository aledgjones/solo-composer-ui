import shortid from "shortid";
import { Instrument } from "./defs";
import { get_def } from "./instrument-defs";

export function create_instrument(id: string): Instrument {
    const { type: instrument_type, long_name, short_name, staves } = get_def(
        id
    );
    return {
        key: shortid(),
        id,
        type: instrument_type,
        long_name,
        short_name,
        staves: staves.map(() => shortid()),
        volume: 80,
        mute: false,
        solo: false,
    };
}
