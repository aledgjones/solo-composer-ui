import { Instruction } from "../render/instructions";
import { EngravingConfig } from "../store/defs";
import { EntryType } from "../store/entries/defs";
import { AbsoluteTempo } from "../store/entries/absolute-tempo/defs";
import { drawAbsoluteTempo } from "../store/entries/absolute-tempo/utils";
import { TimeSignature } from "../store/entries/time-signature/defs";
import { get_entries_at_tick } from "../store/entries/time-signature/utils";
import { Flow } from "../store/score-flow/defs";
import { HorizontalOffsets, WidthOf } from "./measure-horizonal-offsets";

export function drawTempi(
  x: number,
  y: number,
  flow: Flow,
  horizontalOffsets: HorizontalOffsets,
  config: EngravingConfig
): Instruction<any>[] {
  const instructions: Instruction<any>[] = [];

  for (let tick = 0; tick < flow.length; tick++) {
    const tempo = get_entries_at_tick(tick, flow.master, EntryType.AbsoluteTempo)[0] as AbsoluteTempo;
    const time = get_entries_at_tick(tick, flow.master, EntryType.TimeSignature)[0] as TimeSignature;
    if (tempo) {
      // Behind Bars p183
      const upto = time ? WidthOf.TimeSignature : WidthOf.StartRepeat;
      const left = x + horizontalOffsets.get(tick)[upto];
      instructions.push(drawAbsoluteTempo(left, y, tempo, config));
    }
  }

  return instructions;
}
