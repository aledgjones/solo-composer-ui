import { Instruction, InstructionType } from "./instructions";

export interface BoxStyles {
  outline?: {
    color: string;
    thickness: number;
  };
  color: string;
}

export type BoxInstruction = Instruction<{
  styles: BoxStyles;
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export function buildBox(
  key: string,
  styles: BoxStyles,
  x: number,
  y: number,
  width: number,
  height: number,
  className?: string
): BoxInstruction {
  return {
    key,
    type: InstructionType.Box,
    styles,
    x,
    y,
    width,
    height,
    className,
  };
}
