import shortid from "shortid";
import { EngravingConfig, LayoutType } from "./defs";
import { Justify } from "../../render/text";
import { BracketingType, BracketEndStyle } from "../entries/brackets";
import { BarlineDrawType } from "../entries/barline/defs";

export function defaultEngravingConfig(type: LayoutType): EngravingConfig {
  return {
    key: shortid(),
    type,
    space: 2,
    framePadding: { top: 40, right: 25, bottom: 40, left: 25 },
    instrumentSpacing: 8,
    staveSpacing: 6,
    systemStartPadding: 0.75,

    instrumentName: {
      size: 1.75,
      font: "Libre Baskerville",
      align: Justify.End,
      gap: 2,
    },
    tempo: {
      size: 1.75,
      font: "Libre Baskerville",
      align: Justify.Start,
      distanceFromStave: 2,
    },

    systemicBarlineSingleInstrumentSystem: false,
    bracketing: BracketingType.Orchestral,
    bracketEndStyle: BracketEndStyle.Wing,
    bracketSingleStaves: false,
    subBracket: true,

    minNoteSpacing: 1.6,

    finalBarlineType: BarlineDrawType.Final,
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
