import { Entry, EntryType, NoteDuration, DottedValue } from "../defs";

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
