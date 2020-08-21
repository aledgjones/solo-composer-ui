import { EngravingConfig, LayoutType } from "./defs";
import { Justify } from "../../src/render/text";
import shortid from "shortid";
import { BarlineType, BracketEndStyle, BracketingType } from "../entries";

export function defaultEngravingConfig(type: LayoutType): EngravingConfig {
    return {
        key: shortid(),
        type,
        space: type === LayoutType.Score ? 1.5 : 2,
        framePadding: { top: 40, right: 25, bottom: 40, left: 25 },
        instrumentSpacing: 8,
        staveSpacing: 6,
        systemStartPadding: 0.75,

        instrumentName: {
            size: 1.75,
            font: "Libre Baskerville",
            align: Justify.end,
            gap: 2,
        },
        tempo: {
            size: 1.75,
            font: "Libre Baskerville",
            align: Justify.start,
            distanceFromStave: 2,
        },

        systemicBarlineSingleInstrumentSystem: false,
        bracketing: BracketingType.orchestral,
        bracketEndStyle: BracketEndStyle.wing,
        bracketSingleStaves: false,
        subBracket: true,

        minNoteSpacing: 1.6,

        finalBarlineType: BarlineType.final,
    };
}

export function engravingEmptyState() {
    const state: { [key: string]: EngravingConfig } = {};
    const types = [LayoutType.Score, LayoutType.Part];
    types.forEach((type) => {
        const config = defaultEngravingConfig(type);
        state[config.key] = config;
    });
    return state;
}
