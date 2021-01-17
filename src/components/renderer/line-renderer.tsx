import { FC } from "react";
import { merge } from "../../ui";
import { useParseWorker } from "./use-parse-worker";
import { Instruction, InstructionType } from "../../render/instructions";
import { LineInstruction } from "../../render/line";
import { CircleInstruction } from "../../render/circle";
import { TextInstruction, textStyle } from "../../render/text";
import { CurveInstruction, getControlPoints } from "../../render/curve";
import { Text } from "../text";
import { useStore } from "../../store/use-store";
import { BoxInstruction } from "../../render/box";
import { Entry } from "../../store/entries/defs";
import { ShapeInstruction } from "../../render/shape";

interface Props {
  path: LineInstruction;
  space: number;
}

export const LineRenderer: FC<Props> = ({ path, space }) => {
  const def = path.points.map((point, i) => {
    return `${i === 0 ? "M" : "L"} ${point[0] * space} ${point[1] * space}`;
  });
  return <path fill="none" d={def.join(" ")} stroke={path.styles.color} strokeWidth={path.styles.thickness * space} />;
};
