import { Instruction } from "../render/instructions";
import { drawTimeSignature } from "../store/entries/time-signature/utils";
import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";
import { getextrasAtTick } from "./get-extras-at-tick";
import { HorizontalSpacing } from "./measure-tick";
import { VerticalSpacing } from "./measure-verical-spacing";
import { measureWidthUpto } from "./measure-width-upto";
import { WidthOf } from "./sum-width-up-to";

export function drawTimeSignatures(
  x: number,
  y: number,
  staves: Stave[],
  flow: Flow,
  vertical_spacing: VerticalSpacing,
  horizontalSpacing: { [tick: number]: HorizontalSpacing }
): Instruction<any>[] {
  const instructions: Instruction<any>[] = [];

  // barlines
  for (let tick = 0; tick < flow.length; tick++) {
    const { time } = getextrasAtTick(tick, flow);
    if (time) {
      const left = measureWidthUpto(flow, horizontalSpacing, tick, WidthOf.TimeSignature);
      staves.forEach((stave) => {
        instructions.push(...drawTimeSignature(x + left, y + vertical_spacing.staves[stave.key].y, time, stave.key));
      });
    }
  }

  return instructions;
}
