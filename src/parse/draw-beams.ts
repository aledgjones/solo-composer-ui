import { Instruction } from "../render/instructions";
import { buildPath } from "../render/path";
import { Beams } from "./get-beams";
import { VerticalSpacing } from "./measure-verical-spacing";
import { measureWidthUpto, WidthOf } from "./measure-width-upto";
import { HorizontalSpacing } from "./measure-tick";
import { Stave } from "../store/score-stave/defs";

export function drawBeams(
  x: number,
  y: number,
  beams: Beams,
  staves: Stave[],
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  verticalSpacing: VerticalSpacing,
  debug: boolean
) {
  const instructions: Instruction<any>[] = [];

  if (debug) {
    staves.forEach((stave) => {
      stave.tracks.order.forEach((trackKey) => {
        const track = beams[trackKey];
        track.forEach((beam) => {
          instructions.push(
            buildPath(
              `beam-${trackKey}-${beam[0]}`,
              { color: "#000000", thickness: 1 },
              [
                x + measureWidthUpto(horizontalSpacing, 0, beam[0], WidthOf.NoteSpacing),
                y + verticalSpacing.staves[stave.key].y - 3,
              ],
              [
                x + measureWidthUpto(horizontalSpacing, 0, beam[beam.length - 1], WidthOf.NoteSpacing),
                y + verticalSpacing.staves[stave.key].y - 3,
              ]
            )
          );
        });
      });
    });
  }

  return instructions;
}
