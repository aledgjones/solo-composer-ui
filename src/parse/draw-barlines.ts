import { Instruction } from "../render/instructions";
import { buildPath } from "../render/path";
import { BarlineDrawType } from "../store/entries/barline/defs";
import { drawBarline } from "../store/entries/barline/utils";
import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";
import { getBarlineDrawTypeAtTick } from "./get-barline-draw-type-at-tick";
import { getextrasAtTick } from "./get-extras-at-tick";
import { HorizontalSpacing } from "./measure-tick";
import { VerticalSpacing } from "./measure-verical-spacing";
import { VerticalSpans } from "./measure-vertical-spans";
import { measureWidthUpto } from "./measure-width-upto";
import { WidthOf } from "./sum-width-up-to";

export function drawBarlines(
  x: number,
  y: number,
  staves: Stave[],
  flow: Flow,
  vertical_spacing: VerticalSpacing,
  vertical_spans: VerticalSpans,
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  staveWidth: number,
  barlines: Set<number>,
  drawSystemicBarlineSingleStave: boolean,
  finalBarlineType: BarlineDrawType
): Instruction<any>[] {
  const instructions: Instruction<any>[] = [];

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

  // barlines
  for (let tick = 0; tick < flow.length; tick++) {
    const { time, key, barline } = getextrasAtTick(tick, flow);
    const drawTypeAtTick = getBarlineDrawTypeAtTick(tick, key, time, barline, barlines.has(tick));

    if (drawTypeAtTick.endRepeat) {
      instructions.push(
        ...drawBarline(
          x + measureWidthUpto(flow, horizontalSpacing, tick, WidthOf.EndRepeat),
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
          x + measureWidthUpto(flow, horizontalSpacing, tick, WidthOf.Barline),
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
          x + measureWidthUpto(flow, horizontalSpacing, tick, WidthOf.StartRepeat),
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
