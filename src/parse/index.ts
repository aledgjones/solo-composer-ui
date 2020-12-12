import { RenderInstructions, Instruction } from "../render/instructions";
import { LayoutType } from "../store/defs";
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
import { getStavesAsArray } from "./get-staves-as-array";
import { drawTimeSignatures } from "./draw-time-signatures";
import { debugTick } from "./debug-tick";
import { drawKeySignatures } from "./draw-key-signatures";
import { drawClefs } from "./draw-clefs";
import { drawTempi } from "./draw-tempi";
import { getToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { drawNoteheads } from "./draw-noteheads";
import { getNoteSpacing } from "./get-note-spacing";

export function parse(score: Score, flow_key: string, px_per_mm: number, debug: boolean): RenderInstructions {
  const drawInstructions: Instruction<any>[] = [];

  const flow = score.flows.by_key[flow_key];
  // TODO: make this specific to the part type
  const config = Object.values(score.engraving).find((c) => c.type === LayoutType.Score);
  const { px, mm, spaces } = getConverter(px_per_mm, config.space, 2);
  const staves = getStavesAsArray(score.players, score.instruments, flow);

  const counts = getCounts(score.players, score.instruments);
  const names = getInstrumentNamesList(score.players, score.instruments, counts, score.config.auto_count, flow);
  const names_width = measureNames(Object.values(names), config, spaces, px);
  const verticalSpacing = measureVerticalSpacing(score.players, score.instruments, config, flow);
  const verticalSpans = measureVerticalSpans(score.players, score.instruments, config, flow);

  const x =
    mm.toSpaces(config.framePadding.left) +
    names_width +
    config.instrumentName.gap +
    measureBracketAndBraces(verticalSpacing, verticalSpans, config);
  const y = mm.toSpaces(config.framePadding.top);

  const barlines = getFirstBeats(flow);
  const notation = getWrittenDurations(staves, flow, barlines);

  // note vertical offsets
  const toneVerticalOffsets = getToneVerticalOffsets(staves);
  // stem directions
  // note shunts
  // beams/tails

  const horizontalSpacing = measureHorizontalSpacing(staves, flow, barlines, notation, config);

  let width = 0;
  for (let tick = 0; tick < flow.length; tick++) {
    width += horizontalSpacing[tick].reduceRight((out, val) => out + val, 0);
  }

  console.log("");
  console.log("base:", config.baseNoteSpace);
  console.log("ratio", config.noteSpaceRatio);
  console.log("--");
  console.log(
    "half:",
    getNoteSpacing(32, flow.subdivisions, config.baseNoteSpace, config.minNoteSpace, config.noteSpaceRatio)
  );
  console.log(
    "quarter:",
    getNoteSpacing(16, flow.subdivisions, config.baseNoteSpace, config.minNoteSpace, config.noteSpaceRatio)
  );
  console.log(
    "eighth:",
    getNoteSpacing(8, flow.subdivisions, config.baseNoteSpace, config.minNoteSpace, config.noteSpaceRatio)
  );
  console.log(
    "sixteenth:",
    getNoteSpacing(4, flow.subdivisions, config.baseNoteSpace, config.minNoteSpace, config.noteSpaceRatio)
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
    ...drawStaves(x, y, width + measureBarlineBox(config.finalBarlineType).width, staves, verticalSpacing),
    ...drawBraces(x, y, verticalSpacing, verticalSpans),
    ...drawBrackets(x, y, verticalSpacing, verticalSpans, config),
    ...drawSubBrackets(x, y, verticalSpacing, verticalSpans),
    ...drawBarlines(
      x,
      y,
      staves,
      flow,
      verticalSpacing,
      verticalSpans,
      horizontalSpacing,
      width,
      barlines,
      config.systemicBarlineSingleInstrumentSystem,
      config.finalBarlineType
    ),
    ...drawClefs(x, y, staves, flow, verticalSpacing, horizontalSpacing),
    ...drawTimeSignatures(x, y, staves, flow, verticalSpacing, horizontalSpacing),
    ...drawKeySignatures(x, y, staves, flow, verticalSpacing, horizontalSpacing),
    ...drawTempi(x, y, flow, horizontalSpacing, config),
    ...drawNoteheads(x, y, staves, notation, horizontalSpacing, verticalSpacing, toneVerticalOffsets, flow.subdivisions)
  );

  if (debug) {
    drawInstructions.push(...debugTick(x, y, flow, horizontalSpacing, verticalSpacing.height));
  }

  return {
    space: spaces.toPX(1),
    width: x + width + measureBarlineBox(config.finalBarlineType).width + mm.toSpaces(config.framePadding.right),
    height: mm.toSpaces(config.framePadding.top) + verticalSpacing.height + mm.toSpaces(config.framePadding.bottom),
    entries: drawInstructions,
  };
}
