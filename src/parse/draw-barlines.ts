import { Instruction } from "../render/instructions";
import { buildPath } from "../render/path";
import { BarlineDrawType } from "../store/entries/barline/defs";
import { drawBarline } from "../store/entries/barline/utils";
import { Flow } from "../store/score-flow/defs";
import { Instrument } from "../store/score-instrument/defs";
import { Player } from "../store/score-player/defs";
import { getStavesAsArray } from "./get-staves-as-array";
import { VerticalSpacing } from "./measure-verical-spacing";
import { VerticalSpans } from "./measure-vertical-spans";

export function drawBarlines(
  x: number,
  y: number,
  players: { order: string[]; by_key: { [key: string]: Player } },
  instruments: { [key: string]: Instrument },
  flow: Flow,
  vertical_spacing: VerticalSpacing,
  vertical_spans: VerticalSpans,
  staveWidth: number,
  drawSystemicBarlineSingleStave: boolean,
  finalBarlineType: BarlineDrawType
): Instruction<any>[] {
  const instructions: Instruction<any>[] = [];
  const staves = getStavesAsArray(players, instruments, flow);

  // render stystemic barline
  if (staves.length > 1 || drawSystemicBarlineSingleStave) {
    const tweakForStaveLineWidth = 0.0625;
    const styles = { color: "#000000", thickness: 0.125 };
    instructions.push(
      buildPath(
        "systemic-barline",
        styles,
        [x, y - tweakForStaveLineWidth],
        [x, y + vertical_spacing.height + tweakForStaveLineWidth]
      )
    );
  }

  // render final barline
  instructions.push(
    ...drawBarline(
      x + staveWidth,
      y,
      players,
      instruments,
      flow,
      vertical_spacing,
      vertical_spans,
      finalBarlineType,
      "final"
    )
  );
  return instructions;
}
