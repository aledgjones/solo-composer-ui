import { Instruction, InstructionType } from "./instructions";

export interface LineStyles {
  color: string;
  thickness: number;
}

type CoordX = number;
type CoordY = number;
type PathPoint = [CoordX, CoordY];
type Path = PathPoint[];
export type LineInstruction = Instruction<{ styles: LineStyles; points: Path }>;

export function buildLine(key: string, styles: LineStyles, ...points: Path): LineInstruction {
  return {
    key,
    type: InstructionType.Line,
    styles,
    points,
  };
}
