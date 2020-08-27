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
import { FlowItem } from "../setup/flow-item";
import { getWrittenDurations } from "./get-written-durations";

export function parse(
    score: Score,
    flow_key: string,
    px_per_mm: number
): RenderInstructions {
    const TEMPORARY_WIDTH = 100;

    const draw_instructions: Instruction<any>[] = [];

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

    const vertical_spacing = measureVerticalSpacing(
        score.players,
        score.instruments,
        config,
        flow
    );

    const vertical_spans = measureVerticalSpans(
        score.players,
        score.instruments,
        config,
        flow
    );

    const barlines = getFirstBeats(flow);

    const x =
        mm.toSpaces(config.framePadding.left) +
        names_width +
        config.instrumentName.gap +
        measureBracketAndBraces(vertical_spacing, vertical_spans, config);
    const y = mm.toSpaces(config.framePadding.top);

    const notation = getWrittenDurations(
        score.players,
        score.instruments,
        flow,
        barlines
    );

    draw_instructions.push(
        ...drawNames(
            mm.toSpaces(config.framePadding.left),
            mm.toSpaces(config.framePadding.top),
            names_width,
            names,
            score.players,
            flow,
            vertical_spacing,
            config
        ),
        ...drawStaves(
            x,
            y,
            TEMPORARY_WIDTH - x - mm.toSpaces(config.framePadding.right),
            score.players,
            score.instruments,
            flow,
            vertical_spacing,
            config.systemicBarlineSingleInstrumentSystem
        ),
        ...drawBraces(x, y, vertical_spacing, vertical_spans),
        ...drawBrackets(x, y, vertical_spacing, vertical_spans, config),
        ...drawSubBrackets(x, y, vertical_spacing, vertical_spans)
    );

    return {
        space: spaces.toPX(1),
        width: TEMPORARY_WIDTH,
        height:
            mm.toSpaces(config.framePadding.top) +
            vertical_spacing.height +
            mm.toSpaces(config.framePadding.bottom),
        entries: draw_instructions,
    };
}
