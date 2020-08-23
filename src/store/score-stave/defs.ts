import { Track } from "../score-track/defs";

export interface Stave {
    key: String;
    lines: number[];
    master: Track;
    tracks: {
        order: string[];
        by_key: {
            [key: string]: Track;
        };
    };
}
