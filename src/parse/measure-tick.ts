import { Flow } from "../store/score-flow/defs";
import { getBaseDuration, NotationTracks } from "./notation-track";
import { BarlineDrawType } from "../store/entries/barline/defs";
import {
  duration_to_ticks,
  get_entries_at_tick,
  measureTimeSignatureBounds,
} from "../store/entries/time-signature/utils";
import { measureKeySignatureBounds } from "../store/entries/key-signature/utils";
import { measureBarlineBounds } from "../store/entries/barline/utils";
import { getextrasAtTick } from "./get-extras-at-tick";
import { getBarlineDrawTypeAtTick } from "./get-barline-draw-type-at-tick";
import { Stave } from "../store/score-stave/defs";
import { EntryType, NoteDuration } from "../store/entries/defs";
import { measureClefBounds } from "../store/entries/clef/utils";
import { Clef } from "../store/entries/clef/defs";
import { WidthOf } from "./measure-width-upto";
import { widthFromDuration } from "../store/entries/tone/utils";
import { Shunts } from "./get-notehead-shunts";

export type HorizontalSpacing = [
  number, // pre padding (system start)
  number, // End Repeat
  number, // Clef
  number, // Barline
  number, // Key Signature
  number, // Time Signature
  number, // Start Repeat
  number, // Accidentals
  number, // Pre Note Slot
  number, // Post Note Slot
  number, // Note Slot
  number, // Note Spacing
  number // Padding
];

export function measureTick(
  tick: number,
  staves: Stave[],
  flow: Flow,
  isFirstBeat: boolean,
  notation: NotationTracks,
  shunts: Shunts
) {
  const measurements: HorizontalSpacing = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

  if (tick === 0) {
    // systemic barline spacing on first tick
    measurements[WidthOf.PaddingStart] = 1;
  }

  // Time signature / Key Signature
  const { time, key, barline } = getextrasAtTick(tick, flow);

  if (time) {
    measurements[WidthOf.TimeSignature] = measureTimeSignatureBounds(time).width;
  }

  if (key) {
    measurements[WidthOf.KeySignature] = measureKeySignatureBounds(key).width;
  }

  // Barlines
  const drawTypeAtTick = getBarlineDrawTypeAtTick(tick, key, time, barline, isFirstBeat);

  if (drawTypeAtTick.endRepeat) {
    measurements[WidthOf.EndRepeat] = measureBarlineBounds(BarlineDrawType.EndRepeat).width;
  }

  if (drawTypeAtTick.draw_type) {
    measurements[WidthOf.Barline] = measureBarlineBounds(drawTypeAtTick.draw_type).width;
  }

  if (drawTypeAtTick.startRepeat) {
    measurements[WidthOf.StartRepeat] = measureBarlineBounds(BarlineDrawType.StartRepeat).width;
  }

  staves.forEach((stave) => {
    const clef = get_entries_at_tick(tick, stave.master, EntryType.Clef)[0] as Clef;
    if (clef) {
      measurements[WidthOf.Clef] = measureClefBounds(clef).width;
    }
    stave.tracks.order.forEach((trackKey) => {
      const entry = notation[trackKey][tick];
      if (entry) {
        if (entry.tones.length > 0) {
          entry.tones.forEach((tone) => {
            const position = shunts.get(`${tick}-${tone.key}`);
            measurements[position] = widthFromDuration(entry.duration, flow.subdivisions);
          });
        } else {
          measurements[WidthOf.NoteSlot] = widthFromDuration(entry.duration, flow.subdivisions);
        }
      }
    });
  });

  return measurements;
}
