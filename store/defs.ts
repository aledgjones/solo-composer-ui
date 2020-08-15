import { PlaybackDefs } from "./playback/defs";
export * from "./playback/defs";

export enum TimeSignatureDrawType {
    Hidden,
    Normal,
    CommonTime,
    SplitCommonTime,
}

export enum NoteDuration {
    Whole,
    Half,
    Quarter,
    Eighth,
    Sixteenth,
    ThirtySecond,
}

export enum DottedValue {
    Single = 1,
    Double = 2,
}

export enum Articulation {
    None,
    Staccato,
    Staccatissimo,
    Tenuto,
    StaccatoTenuto,
}

export enum Accidental {
    DoubleSharp,
    Sharp,
    Natural,
    Flat,
    DoubleFlat,
}

export interface Pitch {
    int: number;
    accidental: Accidental;
}

export enum Expression {
    Natural,
    Pizzicato,
    Spiccato,
    Staccato,
    Tremolo,
    Mute,
}

export enum ClefDrawType {
    Hidden,
    G,
    F,
    C,
    Percussion,
}

export enum InstrumentType {
    Melodic,
    Percussive,
}

export interface StaveDef {
    lines: number[];
    clef: {
        draw_as: ClefDrawType;
        pitch: number;
        offset: number;
    };
}

export interface InstrumentDef {
    id: string;
    instrument_type: InstrumentType;
    path: string[];
    long_name: string;
    short_name: string;
    staves: StaveDef[];
    patches: {
        [PlayerType.Solo]: Patches;
        [PlayerType.Section]: Patches;
    };
}

export enum AutoCountStyle {
    Arabic,
    Roman,
}

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

export enum PlayerType {
    Solo,
    Section,
}

export interface Player {
    key: string;
    player_type: PlayerType;
    instruments: string[];
    name?: string;
}

export enum EntryType {
    TimeSignature,
    AbsoluteTempo,
    Clef,
    Tone,
}

export interface Entry {
    key: string;
    tick: number;
    type: EntryType;
}

export interface TimeSignature extends Entry {
    type: EntryType.TimeSignature;
    beats: number;
    beat_type: number;
    draw_type: TimeSignatureDrawType;
    groupings: number[];
}

export interface AbsoluteTempo extends Entry {
    type: EntryType.AbsoluteTempo;
    // written representation
    text: string;
    beat_type: NoteDuration;
    dotted: DottedValue;
    bpm: number;

    // written representation config
    parenthesis_visible: boolean;
    text_visible: boolean;
    bpm_visible: boolean;
}

export interface Clef extends Entry {
    type: EntryType.Clef;
    draw_as: ClefDrawType;
    pitch: Pitch; // the pitch that the clef sits on
    offset: number; // visual offset from top stave line
}

export interface Tone extends Entry {
    type: EntryType.Tone;
    duration: number; // ticks
    pitch: Pitch; // MIDI pitch number
    velocity: number; // 0-127
    articulation: Articulation;
}

export interface Entries {
    by_tick: { [tick: number]: string[] };
    by_key: { [key: string]: Entry }; // The typing stop here we will never actually use these js side.
}

export interface Track {
    key: string;
    entries: Entries;
}

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

export interface Flow {
    key: string;
    title: string;
    players: string[];
    subdivisions: number;
    length: number;

    master: Track;
    staves: { [key: string]: Stave };
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
