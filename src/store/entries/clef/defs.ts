import { Entry, EntryType, Pitch } from "../defs";

export enum ClefDrawType {
  Hidden,
  G,
  F,
  C,
  Percussion,
}

export interface Clef extends Entry {
  type: EntryType.Clef;
  draw_as: ClefDrawType;
  pitch: Pitch; // the pitch that the clef sits on
  offset: number; // visual offset from top stave line
}
