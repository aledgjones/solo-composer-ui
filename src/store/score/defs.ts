import { PlayerType, Player } from "../score-player/defs";
import { Instrument } from "../score-instrument/defs";
import { EngravingConfig } from "../score-engraving/defs";
import { Flow } from "../score-flow/defs";
import { AutoCountStyle } from "../score-config/defs";

export interface Meta {
    title: string;
    subtitle: string;
    composer: string;
    arranger: string;
    lyricist: string;
    copyright: string;
    created: number;
    modified: number;
}

export interface Score {
    meta: Meta;
    config: {
        auto_count: {
            [type in PlayerType]: AutoCountStyle;
        };
    };
    engraving: {
        [key: string]: EngravingConfig;
    };
    flows: {
        order: string[];
        by_key: {
            [key: string]: Flow;
        };
    };
    players: {
        order: string[];
        by_key: { [key: string]: Player };
    };
    instruments: {
        [key: string]: Instrument;
    };
}
