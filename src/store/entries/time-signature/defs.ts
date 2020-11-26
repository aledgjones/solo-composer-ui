import { Entry, EntryType, NoteDuration } from "..";

export enum TimeSignatureType {
  Simple,
  Compound,
  Complex,
  Open,
}

export enum TimeSignatureDrawType {
  Hidden,
  Regular,
  CommonTime,
  SplitCommonTime,
  Open,
}

export interface TimeSignature extends Entry {
  type: EntryType.TimeSignature;
  beats: number;
  beat_type: NoteDuration;
  draw_type: TimeSignatureDrawType;
  groupings: number[];
}
