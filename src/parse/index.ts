import { RenderInstructions } from "../render/instructions";
import { LayoutType } from "../store/defs";
import { defaultEngravingConfig } from "../store/score-engraving/utils";
import { getConverter } from "./converter";
import { Score } from "../store/score/defs";
import { getNames } from "../store/score-instrument/utils";

export function parse(
    score: Score,
    flow_key: string,
    mm: number
): RenderInstructions {
    const flow = score.flows.by_key[flow_key];
    const config = defaultEngravingConfig(LayoutType.Score);
    const converter = getConverter(mm, config.space, 2);

    const names = getNames(
        score.players,
        score.instruments,
        score.config.auto_count
    );

    console.log(names);

    return {
        width: 800,
        height: 400,
        entries: [],
    };
}
