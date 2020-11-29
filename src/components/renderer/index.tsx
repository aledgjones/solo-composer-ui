import { FC, memo } from "react";
import { merge } from "../../../ui";
import { useParseWorker } from "./use-parse-worker";
import { Instruction, InstructionType } from "../../render/instructions";
import { PathInstruction } from "../../render/path";
import { CircleInstruction } from "../../render/circle";
import { TextInstruction, alignToStyle, justifyToStyle } from "../../render/text";
import { CurveInstruction, getControlPoints } from "../../render/curve";
import { Text } from "../text";
import { useStore } from "../../store/use-store";
import { BoxInstruction } from "../../render/box";

import "./styles.css";

interface Props {
  className?: string;
}

export const Renderer: FC<Props> = memo(({ className }) => {
  const [score, flow_key, debug] = useStore((s) => [s.score, s.ui.flow_key, s.developer.debug]);
  const instructions = useParseWorker(score, flow_key, debug);

  if (!instructions) {
    return null;
  }

  const { space, width, height, entries } = instructions;

  return (
    <div className={merge("renderer", className)}>
      <div className="renderer__container" style={{ width: width * space, height: height * space }}>
        <p className="renderer__flow-name">{score.flows.by_key[flow_key].title || "Untitled Flow"}</p>
        <svg className="renderer__svg-layer">
          {entries.map((instruction: Instruction<any>) => {
            switch (instruction.type) {
              case InstructionType.path: {
                const path = instruction as PathInstruction;
                const def = path.points.map((point, i) => {
                  return `${i === 0 ? "M" : "L"} ${point[0] * space} ${point[1] * space}`;
                });
                return (
                  <path
                    key={path.key}
                    fill="none"
                    d={def.join(" ")}
                    stroke={path.styles.color}
                    strokeWidth={path.styles.thickness * space}
                  />
                );
              }
              case InstructionType.circle: {
                const circle = instruction as CircleInstruction;
                return (
                  <circle
                    key={circle.key}
                    cx={circle.x * space}
                    cy={circle.y * space}
                    r={circle.radius * space}
                    fill={circle.styles.color}
                  />
                );
              }
              case InstructionType.text: {
                const text = instruction as TextInstruction;
                return (
                  <foreignObject
                    className="renderer__entry--text"
                    key={text.key}
                    x={text.x * space}
                    y={text.y * space}
                    style={{
                      overflow: "visible",
                    }}
                  >
                    <div
                      className="renderer__entry-container--text"
                      style={{
                        position: "absolute",
                        color: text.styles.color,
                        fontFamily: text.styles.font,
                        fontSize: text.styles.size * space,
                        lineHeight: "1em",
                        whiteSpace: "pre",
                        ...alignToStyle(text.styles.align),
                        ...justifyToStyle(text.styles.justify),
                      }}
                    >
                      <Text content={text.value} />
                    </div>
                  </foreignObject>
                );
              }
              case InstructionType.curve: {
                const curve = instruction as CurveInstruction;
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
              }
              case InstructionType.box: {
                const box = instruction as BoxInstruction;
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
                  />
                );
              }
              default:
                return null;
            }
          })}
        </svg>
      </div>
    </div>
  );
});
