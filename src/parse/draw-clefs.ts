import { Instruction } from "../render/instructions";
import { EntryType } from "../store/entries/defs";
import { Clef } from "../store/entries/clef/defs";
import { drawClef } from "../store/entries/clef/utils";
import { get_entries_at_tick } from "../store/entries/time-signature/utils";
import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";
import { VerticalSpacing } from "./measure-verical-spacing";
import { HorizontalOffsets, WidthOf } from "./measure-horizonal-offsets";

export function drawClefs(
  x: number,
  y: number,
  staves: Stave[],
  flow: Flow,
  vertical_spacing: VerticalSpacing,
  horizontalOffsets: HorizontalOffsets
): Instruction<any>[] {
  const instructions: Instruction<any>[] = [];

  staves.forEach((stave) => {
    for (let tick = 0; tick < flow.length; tick++) {
      const clef = get_entries_at_tick(tick, stave.master, EntryType.Clef)[0] as Clef;
      if (clef) {
        const left = horizontalOffsets.get(tick)[WidthOf.Clef];
        instructions.push(drawClef(x + left, y + vertical_spacing.staves[stave.key].y, clef));
      }
    }
  });

  return instructions;
}
