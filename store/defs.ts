import {
    PlayerType,
    AutoCountStyle,
    Accidental,
    NoteDuration,
    TimeSignatureDrawType,
    Articulation,
    InstrumentType,
} from "solo-composer-engine";
import { PlaybackDefs } from "./playback/defs";
import { Track } from "./track";

export * from "./playback/defs";

export enum Status {
    Pending,
    Ready,
    Error,
}

export enum Tool {
    Select,
    Draw,
    Slice,
    Erase,
}

export enum View {
    Setup,
    Write,
    Engrave,
    Play,
    Print,
}

export enum ThemeMode {
    Light,
    Dark,
}

export interface Tick {
    tick: number;
    bar: number;
    beat: number;
    sixteenth: number;
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
    duration: { int: number }; // ticks
    pitch: { int: number; accidental: Accidental }; // MIDI pitch number
    velocity: { int: number }; // 0-127
    articulation: Articulation;
}

export interface TimeSignature {
    key: string;
    tick: number;
    beats: number;
    beat_type: number;
    draw_type: TimeSignatureDrawType;
    groupings: number[];
}

export interface AbsoluteTempo {
    key: string;
    tick: number;
    normalized_bpm: number; // beats per minute in crotchets
    text: string;
    beat_type: NoteDuration;
    dotted: number;
    bpm: number;
    parenthesis_visible: boolean;
    text_visible: boolean;
    bpm_visible: boolean;
}

export interface Patches {
    [expression: string]: string;
}

export interface Instrument {
    key: string;
    id: string;
    instrument_type: InstrumentType;
    long_name: string;
    short_name: string;
    staves: string[];
    count?: number;
    volume: number;
    mute: boolean;
    solo: boolean;
}

export interface Player {
    key: string;
    player_type: PlayerType;
    instruments: string[];
    name?: string;
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

export interface Score {
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
}

export interface State {
    app: {
        theme: ThemeMode;
        audition: boolean;
    };
    playback: PlaybackDefs;
    score: Score;
    ui: {
        ticks: { [flow_key: string]: TickList };
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
