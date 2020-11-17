import { RenderInstructions, Instruction } from "../render/instructions";
import { LayoutType } from "../store/defs";
import { defaultEngravingConfig } from "../store/score-engraving/utils";
import { getConverter } from "./converter";
import { Score } from "../store/score/defs";
import { getCounts } from "../store/score-instrument/utils";
import { measureNames } from "./measure-names";
import { getInstrumentNamesList } from "./get-instrument-names-list";
import { measureVerticalSpacing } from "./measure-verical-spacing";
import { drawNames } from "./draw-names";
import { drawStaves } from "./draw-staves";
import { measureVerticalSpans } from "./measure-vertical-spans";
import { drawBraces } from "./draw-braces";
import { drawBrackets } from "./draw-brackets";
import { drawSubBrackets } from "./draw-sub-brackets";
import { measureBracketAndBraces } from "./measure-brackets-and-braces";
import { getFirstBeats } from "./get-first-beats";
import { getWrittenDurations } from "./get-written-durations";
import { measureBarlineBox } from "../store/entries/barline/utils";
import { drawBarlines } from "./draw-barlines";
import { measureHorizontalSpacing } from "./measure-horizonal-spacing";

export function parse(
  score: Score,
  flow_key: string,
  px_per_mm: number
): RenderInstructions {
  const drawInstructions: Instruction<any>[] = [];

  const flow = score.flows.by_key[flow_key];
  const config = defaultEngravingConfig(LayoutType.Score);
  const { px, mm, spaces } = getConverter(px_per_mm, config.space, 2);

  const counts = getCounts(score.players, score.instruments);
  const names = getInstrumentNamesList(
    score.players,
    score.instruments,
    counts,
    score.config.auto_count,
    flow
  );
  const names_width = measureNames(Object.values(names), config, spaces, px);

  const verticalSpacing = measureVerticalSpacing(
    score.players,
    score.instruments,
    config,
    flow
  );

  const verticalSpans = measureVerticalSpans(
    score.players,
    score.instruments,
    config,
    flow
  );

  const x =
    mm.toSpaces(config.framePadding.left) +
    names_width +
    config.instrumentName.gap +
    measureBracketAndBraces(verticalSpacing, verticalSpans, config);
  const y = mm.toSpaces(config.framePadding.top);

  const barlines = getFirstBeats(flow);
  const notation = getWrittenDurations(
    score.players,
    score.instruments,
    flow,
    barlines
  );

  const { horizontalMeasurements, width } = measureHorizontalSpacing(
    score.players,
    score.instruments,
    flow,
    barlines,
    notation
  );

  drawInstructions.push(
    ...drawNames(
      mm.toSpaces(config.framePadding.left),
      mm.toSpaces(config.framePadding.top),
      names_width,
      names,
      score.players,
      flow,
      verticalSpacing,
      config
    ),
    ...drawStaves(
      x,
      y,
      width + measureBarlineBox(config.finalBarlineType).width,
      score.players,
      score.instruments,
      flow,
      verticalSpacing
    ),
    ...drawBraces(x, y, verticalSpacing, verticalSpans),
    ...drawBrackets(x, y, verticalSpacing, verticalSpans, config),
    ...drawSubBrackets(x, y, verticalSpacing, verticalSpans),
    ...drawBarlines(
      x,
      y,
      score.players,
      score.instruments,
      flow,
      verticalSpacing,
      verticalSpans,
      width,
      config.systemicBarlineSingleInstrumentSystem,
      config.finalBarlineType
    )
  );

  return {
    space: spaces.toPX(1),
    width:
      x +
      width +
      measureBarlineBox(config.finalBarlineType).width +
      mm.toSpaces(config.framePadding.right),
    height:
      mm.toSpaces(config.framePadding.top) +
      verticalSpacing.height +
      mm.toSpaces(config.framePadding.bottom),
    entries: drawInstructions,
  };
}
