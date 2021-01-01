import { Instruction } from "../render/instructions";
import { drawNotehead } from "../store/entries/tone/utils";
import { Stave } from "../store/score-stave/defs";
import { Shunts } from "./get-notehead-shunts";
import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { HorizontalSpacing } from "./measure-tick";
import { VerticalSpacing } from "./measure-verical-spacing";
import { measureWidthUpto, WidthOf } from "./measure-width-upto";
import { NotationTracks } from "./notation-track";

export function drawNoteheads(
  x: number,
  y: number,
  staves: Stave[],
  notation: NotationTracks,
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  verticalSpacing: VerticalSpacing,
  toneVerticalOffsets: ToneVerticalOffsets,
  shunts: Shunts,
  subdivisions: number
) {
  const instructions: Instruction<any>[] = [];

  staves.forEach((stave) => {
    const top = y + verticalSpacing.staves[stave.key].y;
    stave.tracks.order.forEach((trackKey) => {
      const track = notation[trackKey];
      const ticks = Object.keys(track).map((t) => parseInt(t));
      ticks.forEach((tick) => {
        const entry = track[tick];
        entry.tones.forEach((tone) => {
          instructions.push(
            ...drawNotehead(
              tick,
              x,
              top,
              entry.duration,
              toneVerticalOffsets.get(tone.key),
              shunts.get(tone.key),
              subdivisions,
              horizontalSpacing,
              tone.key + tick
            )
          );
        });
      });
    });
  });

  return instructions;
}
