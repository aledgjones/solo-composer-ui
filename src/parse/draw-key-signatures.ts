import { Instruction } from "../render/instructions";
import { EntryType } from "../store/entries/defs";
import { Clef } from "../store/entries/clef/defs";
import { KeySignature } from "../store/entries/key-signature/defs";
import { drawKeySignature } from "../store/entries/key-signature/utils";
import { get_entries_at_tick } from "../store/entries/time-signature/utils";
import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";
import { HorizontalSpacing } from "./measure-tick";
import { VerticalSpacing } from "./measure-verical-spacing";
import { HorizontalOffsets, WidthOf } from "./measure-horizonal-offsets";

export function drawKeySignatures(
  x: number,
  y: number,
  staves: Stave[],
  flow: Flow,
  vertical_spacing: VerticalSpacing,
  horizontalOffsets: HorizontalOffsets
): Instruction<any>[] {
  const instructions: Instruction<any>[] = [];

  staves.forEach((stave) => {
    let clef;
    for (let tick = 0; tick < flow.length; tick++) {
      clef = (get_entries_at_tick(tick, stave.master, EntryType.Clef)[0] as Clef) || clef;
      const key = get_entries_at_tick(tick, flow.master, EntryType.KeySignature)[0] as KeySignature;
      if (key && clef) {
        const left = horizontalOffsets.get(tick)[WidthOf.KeySignature];
        instructions.push(
          ...drawKeySignature(x + left, y + vertical_spacing.staves[stave.key].y, clef, key, stave.key)
        );
      }
    }
  });

  return instructions;
}
