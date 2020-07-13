import { PlayerType, AutoCountStyle, Accidental, NoteDuration } from "solo-composer-engine";
import { PlaybackDefs } from "./playback/defs";

export * from "./playback/defs";

export enum Status {
    Pending,
    Ready,
    Error
}

export enum Tool {
    Select,
    Draw,
    Slice,
    Erase
}

export enum View {
    Setup,
    Write,
    Engrave,
    Play,
    Print
}

export enum ThemeMode {
    Light,
    Dark
}

export interface Tick {
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

export interface Tone {
    key: string;
    tick: number;
    duration: { int: number };
    pitch: { int: number; accidental: Accidental };
}

export interface Patches {
    [expression: string]: string;
}

export interface Instrument {
    key: string;
    id: string;
    long_name: string;
    short_name: string;
    staves: string[];
    count?: number;
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
    master: Track;
    tracks: string[];
}

export interface Flow {
    key: string;
    title: string;
    players: string[];
    subdivisions: number;
    length: number;
    master: Track;

    staves: { [key: string]: Stave };
    tracks: { [key: string]: Track };
}

export interface State {
    app: {
        theme: ThemeMode;
        audition: boolean;
    };
    playback: PlaybackDefs;
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
                solo: AutoCountStyle;
                section: AutoCountStyle;
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
            [key: string]: Instrument;
        };
    };
    ticks: {
        [key: string]: TickList;
    };
    ui: {
        view: View;
        snap: NoteDuration;
        flow_key: string;
        setup: {
            expanded: { [key: string]: boolean };
        };
        play: {
            selected: { [key: string]: boolean };
            expanded: { [key: string]: boolean };
            keyboard: { [key: string]: { base: number; height: number } };
            tool: Tool;
            zoom: number;
        };
    };
}
