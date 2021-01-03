import { Entry, EntryType } from "../store/entries/defs";

export enum InstructionType {
  path = 1,
  text,
  circle,
  curve,
  box,
}

export interface InstructionBase {
  key: string;
  type: InstructionType;
  entry?: Entry;
}
export type Instruction<T> = InstructionBase & T;

export interface RenderInstructions {
  space: number;
  height: number;
  width: number;
  entries: Instruction<any>[];
}
