import { Entry, EntryType, Pitch, Articulation } from "..";

export interface Tone extends Entry {
  type: EntryType.Tone;
  duration: number; // ticks
  pitch: Pitch; // MIDI pitch number
  velocity: number; // 0-127
  articulation: Articulation;
}
