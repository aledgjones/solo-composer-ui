import { FC } from "react";
import { LineInstruction } from "../../render/line";

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
