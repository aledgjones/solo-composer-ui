import { Player } from "../store/score-player/defs";
import { Instrument } from "../store/score-instrument/defs";
import { Flow } from "../store/score-flow/defs";
import { NotationTracks } from "./notation-track";
import { BarlineDrawType, Barline } from "../store/entries/barline/defs";
import {
  get_entries_at_tick,
  measureTimeSignatureBounds,
} from "../store/entries/time-signature/utils";
import { EntryType } from "../store/entries";
import { TimeSignature } from "../store/entries/time-signature/defs";
import { KeySignature } from "../store/entries/key-signature/defs";
import { WidthOf } from "./sum-width-up-to";
import { measureKeySignatureBounds } from "../store/entries/key-signature/utils";
import { measureBarlineBounds } from "../store/entries/barline/utils";

export type HorizontalSpacing = [
  number, // End Repeat
  number, // Clef
  number, // Barline
  number, // Key Signature
  number, // Time Signature
  number, // Start Repeat
  number, // Accidentals
  number, // Pre Note Slot
  number, // Note Slot
  number, // Note Spacing
  number // Padding
];

export function getextrasAtTick(tick: number, flow: Flow) {
  const time = get_entries_at_tick(
    tick,
    flow.master,
    EntryType.TimeSignature
  )[0] as TimeSignature;
  const key = get_entries_at_tick(
    tick,
    flow.master,
    EntryType.KeySignature
  )[0] as KeySignature;
  const barline = get_entries_at_tick(
    tick,
    flow.master,
    EntryType.Barline
  )[0] as Barline;
  return { time, key, barline };
}
