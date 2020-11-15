import { MMs, Spaces } from "../defs";
import { Justify } from "../../render/text";
import { BracketingType, BracketEndStyle } from "../entries/brackets";
import { BarlineType } from "../entries/defs";

export enum LayoutType {
  Score, // used for default score
  Part, // used for default part
  Custom, // manually assigned
}

export type PartialEngravingConfig = Partial<EngravingConfig>;

export interface EngravingConfig {
  key: string;
  type: LayoutType;

  space: MMs; // 8mm staves (1 * 8)

  framePadding: { top: MMs; right: MMs; bottom: MMs; left: MMs };
  instrumentSpacing: Spaces;
  staveSpacing: Spaces;
  systemStartPadding: Spaces;

  instrumentName: { size: Spaces; font: string; align: Justify; gap: Spaces };
  tempo: {
    size: Spaces;
    font: string;
    align: Justify;
    distanceFromStave: number;
  };

  systemicBarlineSingleInstrumentSystem: boolean;
  bracketing: BracketingType;
  bracketEndStyle: BracketEndStyle;
  bracketSingleStaves: boolean;
  subBracket: boolean;

  minNoteSpacing: Spaces;

  finalBarlineType: BarlineType;
}
