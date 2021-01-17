import { FC } from "react";
import { BoxInstruction } from "../../render/box";

interface Props {
  box: BoxInstruction;
  space: number;
}

export const BoxRenderer: FC<Props> = ({ box, space }) => {
  return (
    <rect
      key={box.key}
      x={box.x * space}
      y={box.y * space}
      width={box.width * space}
      height={box.height * space}
      fill={box.styles.color}
      stroke={box.styles.outline ? box.styles.outline.color : undefined}
      strokeWidth={box.styles.outline ? box.styles.outline.thickness * space : undefined}
      className={box.className}
    />
  );
};
