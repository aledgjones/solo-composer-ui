import { Entry } from "../store/entries/defs";

export enum InstructionType {
  Line = 1,
  Text,
  Circle,
  Curve,
  Box,
  Shape,
}

export interface InstructionBase {
  key: string;
  type: InstructionType;
  className?: string;
  entry?: Entry;
}
export type Instruction<T> = InstructionBase & T;

export interface RenderInstructions {
  space: number;
  height: number;
  width: number;
  entries: Instruction<any>[];
}
