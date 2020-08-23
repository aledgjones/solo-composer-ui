import { Entry, EntryType } from "..";

export enum TimeSignatureType {
    Simple,
    Compound,
    Complex,
    Open,
}

export enum TimeSignatureDrawType {
    Hidden,
    Normal,
    CommonTime,
    SplitCommonTime,
}

export interface TimeSignature extends Entry {
    type: EntryType.TimeSignature;
    beats: number;
    beat_type: number;
    draw_type: TimeSignatureDrawType;
    groupings: number[];
}
