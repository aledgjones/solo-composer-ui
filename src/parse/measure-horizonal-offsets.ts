import { flowActions } from "../store/score-flow/actions";
import { Flow } from "../store/score-flow/defs";
import { HorizontalSpacing } from "./measure-tick";

export enum WidthOf {
  PaddingStart,
  EndRepeat,
  Clef,
  Barline,
  KeySignature,
  TimeSignature,
  StartRepeat,
  Accidentals,
  PreNoteSlot,
  NoteSlot,
  PostNoteSlot,
  NoteSpacing,
  PaddingEnd,
}

export type HorizontalOffsets = Map<number, number[]>;

export function measureHorizontalOffsets(flow: Flow, horizontalSpacing: { [tick: number]: HorizontalSpacing }) {
  const horizontalOffsets: HorizontalOffsets = new Map();

  let width = 0.0;
  for (let tick = 0; tick < flow.length; tick++) {
    const spacing = horizontalSpacing[tick];
    const offsets: number[] = [];
    for (let ii = 0; ii < spacing.length; ii++) {
      offsets[ii] = width;
      width += spacing[ii];
    }
    horizontalOffsets.set(tick, offsets);
  }
  return { horizontalOffsets, width };
}
