import { Gain, Sampler } from "tone";
import { Status } from "../defs";

export interface PatchFromFile {
    envelope: {
        attack: number;
        release: number;
    };
    samples: {
        [note: string]: string;
    };
}

export interface Samplers {
    [instrumentKey: string]: {
        gain: Gain;
        expressions: {
            [expression: number]: Sampler;
        };
    };
}

export interface PlaybackDefs {
    metronome: boolean;
    transport: {
        playing: boolean;
    };
    instruments: {
        [instrumentKey: string]: {
            key: string;
            id: string;
            status: Status;
            progress: number;
            volume: number;
            mute: boolean;
            solo: boolean;
            expressions: {
                [key: number]: {
                    key: number;
                    status: Status;
                    progress: number;
                };
            };
        };
    };
}
