import { Track } from "../score-track/defs";
import { Stave } from "../score-stave/defs";

export interface Flow {
    key: string;
    title: string;
    players: string[];
    subdivisions: number;
    length: number;

    master: Track;
    staves: { [key: string]: Stave };
}

export interface Tick {
    tick: number;
    x: number;
    width: number;
    is_beat: boolean;
    is_first_beat: boolean;
    is_quaver_beat: boolean;
    is_grouping_boundry: boolean;
}

export interface TickList {
    list: Tick[];
    width: number;
}
