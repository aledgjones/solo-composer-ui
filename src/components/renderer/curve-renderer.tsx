import { FC } from "react";
import { CurveInstruction, getControlPoints } from "../../render/curve";

interface Props {
  curve: CurveInstruction;
  space: number;
}

export const CurveRenderer: FC<Props> = ({ curve, space }) => {
  const def: string[] = [];

  const points = getControlPoints(curve.points[0], curve.points[1], curve.points[2]);
  const [P0, P1, P2, P3, P4, P5] = points;

  def.push(`M ${P0.x * space} ${P0.y * space}`);
  def.push(`Q ${P1.x * space} ${P1.y * space}, ${P2.x * space} ${P2.y * space}`);
  def.push(`L ${P3.x * space} ${P3.y * space}`);
  def.push(`Q ${P4.x * space} ${P4.y * space}, ${P5.x * space} ${P5.y * space}`);

  return <path key={curve.key} fill={curve.styles.color} d={def.join(" ")} />;

  // DEBUG
  // return <>
  //     <path key={curve.key} fill={curve.styles.color} d={def.join(" ")} />
  //     {curve.points.map(point => {
  //         return <circle style={{ zIndex: 1000 }} cx={point.x * space} cy={point.y * space} r={0.25 * space} fill="green" />
  //     })}
  //     {points.map(point => {
  //         return <circle style={{ zIndex: 1000 }} cx={point.x * space} cy={point.y * space} r={0.25 * space} fill="red" />
  //     })}
  // </>
};
