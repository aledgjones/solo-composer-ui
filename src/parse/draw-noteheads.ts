import { Instruction } from "../render/instructions";
import { drawNotehead } from "../store/entries/tone/utils";
import { Stave } from "../store/score-stave/defs";
import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { HorizontalSpacing } from "./measure-tick";
import { VerticalSpacing } from "./measure-verical-spacing";
import { measureWidthUpto } from "./measure-width-upto";
import { Notation, NotationTracks } from "./notation-track";
import { WidthOf } from "./sum-width-up-to";

export function drawNoteheads(
  x: number,
  y: number,
  staves: Stave[],
  notation: NotationTracks,
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  verticalSpacing: VerticalSpacing,
  toneVerticalOffsets: ToneVerticalOffsets,
  subdivisions: number
) {
  const instructions: Instruction<any>[] = [];

  staves.forEach((stave) => {
    const top = y + verticalSpacing.staves[stave.key].y;
    stave.tracks.order.forEach((trackKey) => {
      const track = notation[trackKey];
      Object.entries(track).forEach(([tick, entry]: [string, Notation]) => {
        const left = x + measureWidthUpto(horizontalSpacing, parseInt(tick), WidthOf.NoteSlot);
        entry.tones.forEach((tone) => {
          instructions.push(
            drawNotehead(left, top, entry.duration, toneVerticalOffsets[tone.key], subdivisions, tone.key + tick)
          );
        });
      });
    });
  });

  return instructions;
}
