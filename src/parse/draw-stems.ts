import { Instruction } from "../render/instructions";
import { buildLine } from "../render/line";
import { VerticalSpacing } from "./measure-verical-spacing";
import { HorizontalSpacing } from "./measure-tick";
import { Stave } from "../store/score-stave/defs";
import { StemDirectionsByTrack, StemDirectionType } from "./get-stem-directions";
import { StemLengthsByTrack } from "./get-stem-lengths";
import { HorizontalOffsets, WidthOf } from "./measure-horizonal-offsets";

export function drawStems(
  x: number,
  y: number,
  staves: Stave[],
  stemDirections: StemDirectionsByTrack,
  stemLengths: StemLengthsByTrack,
  horizontalOffsets: HorizontalOffsets,
  verticalSpacing: VerticalSpacing
) {
  const instructions: Instruction<any>[] = [];

  const width = 0.125;

  staves.forEach((stave) => {
    stave.tracks.order.forEach((trackKey) => {
      const directions = stemDirections[trackKey];
      const lengths = stemLengths[trackKey];

      lengths.forEach((entry, tick) => {
        const direction = directions.get(tick);
        const upto = direction === StemDirectionType.Up ? WidthOf.PostNoteSlot : WidthOf.NoteSlot;
        const stemModifier = direction === StemDirectionType.Up ? -1 : 1;
        const left = x + horizontalOffsets.get(tick)[upto] + (width / 2) * stemModifier;

        const start = y + verticalSpacing.staves[stave.key].y + entry.head;
        const stop = y + verticalSpacing.staves[stave.key].y + entry.tail;

        instructions.push(
          buildLine(`stem-${trackKey}-${tick}`, { color: "#000000", thickness: width }, [left, start], [left, stop])
        );
      });
    });
  });

  return instructions;
}
