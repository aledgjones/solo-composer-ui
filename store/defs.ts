import { View, InstrumentAutoCountStyle, ThemeMode, NoteLength, PlayerType, PlayTool } from "solo-composer-engine";

export interface Patches {
    [expression: string]: string;
}

export interface Instrument {
    key: string;
    id: string;
    long_name: string;
    short_name: string;
    staves: string[];
}

export interface Player {
    key: string;
    player_type: PlayerType;
    instruments: string[];
    name?: string;
}

export interface Entries {
    order: string[];
    by_key: { [key: string]: any }; // The typing stop here we will never actually use these js side.
}

export interface Track {
    key: string;
    entries: Entries;
}

export interface Stave {
    key: string;
    lines: number;
    mater: Track;
    tracks: string[];
}

export interface Flow {
    key: string;
    title: string;
    players: string[];
    tick_length: NoteLength;
    length: number;

    staves: { [key: string]: Stave };
    tracks: { [key: string]: Track };
}

export interface AutoCountConfig {
    active: boolean;
    style: InstrumentAutoCountStyle;
}

export interface State {
    app: {
        theme: ThemeMode;
        audition: boolean;
    };
    playback: {
        metronome: boolean;
    };
    score: {
        meta: {
            title: string;
            subtitle: string;
            composer: string;
            arranger: string;
            lyricist: string;
            copyright: string;
            created: number;
            modified: number;
        };
        config: {
            auto_count: {
                solo: AutoCountConfig;
                section: AutoCountConfig;
            };
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
            [ket: string]: Instrument;
        };
    };
    ui: {
        view: View;
        expanded: { [key: string]: boolean };
        play_tool: PlayTool;
    };
}
