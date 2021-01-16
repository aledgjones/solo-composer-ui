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

import "./styles.css";

interface Props {
  className?: string;
  selection?: { [key: string]: Entry };
  onSelect?: (data: Entry) => void;
}

export const Renderer: FC<Props> = ({ selection, className, children, onSelect }) => {
  const [score, flow_key, debug, timings, experimental] = useStore((s) => [
    s.score,
    s.ui.flow_key,
    s.developer.debug,
    s.developer.timings,
    s.developer.experimental,
  ]);
  const instructions = useParseWorker(score, flow_key, debug, timings, experimental);

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
              case InstructionType.Line: {
                const path = instruction as LineInstruction;
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

              case InstructionType.Circle: {
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

              case InstructionType.Text: {
                const text = instruction as TextInstruction;
                return (
                  <foreignObject
                    className="renderer__entry--text no-scroll"
                    key={text.key}
                    x={text.x * space}
                    y={text.y * space}
                    style={{
                      overflow: "visible",
                    }}
                  >
                    <div
                      onClick={() => {
                        if (onSelect && text.entry) {
                          onSelect(text.entry);
                        }
                      }}
                      className={merge(
                        "renderer__entry-container--text",
                        {
                          "entry--selected": text.entry && selection && !!selection[text.entry.key],
                        },
                        text.className
                      )}
                      style={{
                        position: "absolute",
                        color: text.styles.color,
                        fontFamily: text.styles.font,
                        fontSize: text.styles.size * space,
                        lineHeight: text.styles.lineHeight,
                        whiteSpace: "pre",
                        ...textStyle(text.styles.align, text.styles.justify),
                      }}
                    >
                      <Text content={text.value} />
                    </div>
                  </foreignObject>
                );
              }

              case InstructionType.Curve: {
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

              case InstructionType.Box: {
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
                    className={box.className}
                  />
                );
              }

              case InstructionType.Shape: {
                const path = instruction as ShapeInstruction;
                const def = path.points.map((point, i) => {
                  return `${i === 0 ? "M" : "L"} ${point[0] * space} ${point[1] * space}`;
                });
                return <path key={path.key} fill={path.styles.color} d={def.join(" ")} stroke={path.styles.color} />;
              }
              default:
                return null;
            }
          })}
        </svg>
        {children}
      </div>
    </div>
  );
};
