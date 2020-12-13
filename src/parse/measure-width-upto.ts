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

export function measureWidthUpto(
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  from: number,
  to: number,
  WidthOf: WidthOf
) {
  let width = 0.0;
  for (let tick = from; tick < to; tick++) {
    width += horizontalSpacing[tick].reduce((out, w) => out + w, 0.0);
  }
  const finalWidth = horizontalSpacing[to];
  if (finalWidth) {
    for (let ii = 0; ii < WidthOf; ii++) {
      width += finalWidth[ii];
    }
  }
  return width;
}
