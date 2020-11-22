import { Entry, EntryType } from "..";

export enum BarlineDrawType {
  None,
  Normal,
  Double,
  Final,
  StartRepeat,
  EndRepeat,
  EndStartRepeat,
}

export interface Barline extends Entry {
  type: EntryType.Barline;
  draw_type: BarlineDrawType;
}
