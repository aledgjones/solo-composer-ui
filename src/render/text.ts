import { Instruction, InstructionType } from "./instructions";

export enum Justify {
  Start,
  Middle,
  End,
}

export function justifyToStyle(justify: Justify) {
  switch (justify) {
    case Justify.Start:
      return {
        left: 0,
      };
    case Justify.Middle:
      return {
        left: 0,
        transform: "translateX(-50%)",
      };
    case Justify.End:
      return {
        right: 0,
      };

    default:
      return {};
  }
}

export enum Align {
  Top,
  Middle,
  Bottom,
}

export function alignToStyle(align: Align) {
  switch (align) {
    case Align.Top:
      return {
        top: 0,
      };
    case Align.Middle:
      return {
        top: 0,
        transform: "translateY(-50%)",
      };
    case Align.Bottom:
      return {
        bottom: 0,
      };

    default:
      return {};
  }
}

export interface TextStyles {
  color: string;
  font: string;
  size: number;
  justify: Justify;
  align: Align;
}

export type Text = { styles: TextStyles; value: string; x: number; y: number };
export type TextInstruction = Instruction<Text>;

export function buildText(key: string, styles: TextStyles, x: number, y: number, value: string): TextInstruction {
  return {
    key,
    type: InstructionType.text,
    styles,
    x,
    y,
    value,
  };
}
