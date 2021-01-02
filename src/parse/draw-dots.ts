import { Instruction } from "../render/instructions";
import { drawDot } from "../store/entries/tone/utils";
import { Stave } from "../store/score-stave/defs";
import { DotsByTrack } from "./get-dot-slots";
import { Shunts } from "./get-notehead-shunts";
import { HorizontalSpacing } from "./measure-tick";
import { VerticalSpacing } from "./measure-verical-spacing";
import { NotationTracks } from "./notation-track";

export function drawDots(
  x: number,
  y: number,
  staves: Stave[],
  notation: NotationTracks,
  dots: DotsByTrack,
  shunts: Shunts,
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  verticalSpacing: VerticalSpacing
) {
  const instructions: Instruction<any>[] = [];

  staves.forEach((stave) => {
    const top = y + verticalSpacing.staves[stave.key].y;
    stave.tracks.order.forEach((trackKey) => {
      const dotsInTrack = dots[trackKey];
      const notationTrack = notation[trackKey];
      dotsInTrack.forEach((offsets, tick) => {
        offsets.forEach((offset) => {
          instructions.push(
            drawDot(
              tick,
              x,
              top,
              offset,
              shunts,
              notationTrack[tick],
              horizontalSpacing,
              `dot-${trackKey}-${tick}-${offset}`
            )
          );
        });
      });
    });
  });

  return instructions;
}
