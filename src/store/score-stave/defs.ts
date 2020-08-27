import { Track } from "../score-track/defs";

export interface Stave {
    key: string;
    lines: number[];
    master: Track;
    tracks: {
        order: string[];
        by_key: {
            [key: string]: Track;
        };
    };
}
