import { FC } from "react";
import { CircleInstruction } from "../../render/circle";

interface Props {
  circle: CircleInstruction;
  space: number;
}

export const CircleRenderer: FC<Props> = ({ circle, space }) => {
  return (
    <circle
      key={circle.key}
      cx={circle.x * space}
      cy={circle.y * space}
      r={circle.radius * space}
      fill={circle.styles.color}
    />
  );
};
