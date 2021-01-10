import { Entry } from "../store/entries/defs";
import { Instruction, InstructionType } from "./instructions";

export enum Justify {
  Start,
  Middle,
  End,
}

export enum Align {
  Top,
  Middle,
  Bottom,
}

export function textStyle(align: Align, justify: Justify) {
  return {
    left: justify === Justify.End ? undefined : 0,
    right: justify === Justify.End ? 0 : undefined,
    top: align === Align.Bottom ? undefined : 0,
    bottom: align === Align.Bottom ? 0 : undefined,
    transform: `translate(${justify === Justify.Middle ? "-50%" : 0}, ${align === Align.Middle ? "-50%" : 0})`,
  };
}

export interface TextStyles {
  color: string;
  font: string;
  size: number;
  justify: Justify;
  align: Align;
  lineHeight: number;
}

export type Text = { styles: TextStyles; value: string; x: number; y: number };
export type TextInstruction = Instruction<Text>;

export function buildText(
  key: string,
  styles: TextStyles,
  x: number,
  y: number,
  value: string,
  entry?: Entry,
  className?: string
): TextInstruction {
  return {
    key,
    type: InstructionType.Text,
    styles,
    x,
    y,
    value,
    entry,
    className,
  };
}
