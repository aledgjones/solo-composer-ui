import { Instruction } from "../render/instructions";
import { buildLine } from "../render/line";
import { BarlineDrawType } from "../store/entries/barline/defs";
import { drawBarline } from "../store/entries/barline/utils";
import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";
import { getBarlineDrawTypeAtTick } from "./get-barline-draw-type-at-tick";
import { Barlines } from "./get-barlines";
import { getextrasAtTick } from "./get-extras-at-tick";
import { HorizontalOffsets, WidthOf } from "./measure-horizonal-offsets";
import { VerticalSpacing } from "./measure-verical-spacing";
import { VerticalSpans } from "./measure-vertical-spans";

export function drawBarlines(
  x: number,
  y: number,
  staves: Stave[],
  flow: Flow,
  vertical_spacing: VerticalSpacing,
  vertical_spans: VerticalSpans,
  horizontalOffsets: HorizontalOffsets,
  staveWidth: number,
  barlines: Barlines,
  drawSystemicBarlineSingleStave: boolean,
  finalBarlineType: BarlineDrawType
): Instruction<any>[] {
  const instructions: Instruction<any>[] = [];

  // render stystemic barline
  if (staves.length > 1 || drawSystemicBarlineSingleStave) {
    const tweakForStaveLineWidth = 0.0625;
    const styles = { color: "#000000", thickness: 0.125 };
    instructions.push(
      buildLine(
        "systemic-barline",
        styles,
        [x, y - tweakForStaveLineWidth],
        [x, y + vertical_spacing.height + tweakForStaveLineWidth]
      )
    );
  }

  // barlines
  for (let tick = 0; tick < flow.length; tick++) {
    const { time, key, barline } = getextrasAtTick(tick, flow);
    const drawTypeAtTick = getBarlineDrawTypeAtTick(tick, key, time, barline, barlines.has(tick));

    if (drawTypeAtTick.endRepeat) {
      instructions.push(
        ...drawBarline(
          x + horizontalOffsets.get(tick)[WidthOf.EndRepeat],
          y,
          staves,
          vertical_spacing,
          vertical_spans,
          BarlineDrawType.EndRepeat,
          `barline-end-repeat-${tick}`
        )
      );
    }

    if (drawTypeAtTick.draw_type) {
      instructions.push(
        ...drawBarline(
          x + horizontalOffsets.get(tick)[WidthOf.Barline],
          y,
          staves,
          vertical_spacing,
          vertical_spans,
          drawTypeAtTick.draw_type,
          `barline-${drawTypeAtTick.draw_type}-${tick}`
        )
      );
    }

    if (drawTypeAtTick.startRepeat) {
      instructions.push(
        ...drawBarline(
          x + horizontalOffsets.get(tick)[WidthOf.StartRepeat],
          y,
          staves,
          vertical_spacing,
          vertical_spans,
          BarlineDrawType.StartRepeat,
          `barline-start-repeat-${tick}`
        )
      );
    }
  }

  // render final barline
  instructions.push(
    ...drawBarline(x + staveWidth, y, staves, vertical_spacing, vertical_spans, finalBarlineType, "final")
  );
  return instructions;
}
