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
}
export type Instruction<T> = InstructionBase & T;

export interface RenderInstructions {
  space: number;
  height: number;
  width: number;
  entries: Instruction<any>[];
}
