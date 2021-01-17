import { FC } from "react";
import { ShapeInstruction } from "../../render/shape";

interface Props {
  path: ShapeInstruction;
  space: number;
}

export const ShapeRenderer: FC<Props> = ({ path, space }) => {
  const def = path.points.map((point, i) => {
    return `${i === 0 ? "M" : "L"} ${point[0] * space} ${point[1] * space}`;
  });
  return <path key={path.key} fill={path.styles.color} d={def.join(" ")} stroke={path.styles.color} />;
};
