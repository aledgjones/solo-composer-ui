import { Instruction } from "../render/instructions";
import { drawTimeSignature } from "../store/entries/time-signature/utils";
import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";
import { getextrasAtTick } from "./get-extras-at-tick";
import { HorizontalOffsets, WidthOf } from "./measure-horizonal-offsets";
import { VerticalSpacing } from "./measure-verical-spacing";

export function drawTimeSignatures(
  x: number,
  y: number,
  staves: Stave[],
  flow: Flow,
  vertical_spacing: VerticalSpacing,
  horizontalOffset: HorizontalOffsets
): Instruction<any>[] {
  const instructions: Instruction<any>[] = [];

  // barlines
  for (let tick = 0; tick < flow.length; tick++) {
    const { time } = getextrasAtTick(tick, flow);
    if (time) {
      const left = horizontalOffset.get(tick)[WidthOf.TimeSignature];
      staves.forEach((stave) => {
        instructions.push(...drawTimeSignature(x + left, y + vertical_spacing.staves[stave.key].y, time, stave.key));
      });
    }
  }

  return instructions;
}
