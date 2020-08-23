import React, { FC, memo } from "react";
import { merge } from "../../../ui";
import { useParseWorker } from "./use-parse-worker";
import { Instruction, InstructionType } from "../../render/instructions";
import { PathInstruction } from "../../render/path";
import { CircleInstruction } from "../../render/circle";
import { TextInstruction } from "../../render/text";
import { CurveInstruction, getControlPoints } from "../../render/curve";
import { Text } from "../text";
import { useStore } from "../../store/use-store";

import "./styles.css";

interface Props {
    className?: string;
}

export const Renderer: FC<Props> = memo(({ className }) => {
    const [score, flow_key] = useStore((s) => [
        s.score,
        s.ui.flow_key || s.score.flows.order[0],
    ]);
    const instructions = useParseWorker(score, flow_key);

    if (!instructions) {
        return null;
    }

    const { width, height, entries } = instructions;

    return (
        <div className={merge("renderer", className)}>
            <div className="renderer__container" style={{ width, height }}>
                <p className="renderer__flow-name">
                    {score.flows.by_key[flow_key].title || "Untitled Flow"}
                </p>
                <svg className="renderer__svg-layer">
                    {entries.map((instruction: Instruction<any>) => {
                        switch (instruction.type) {
                            case InstructionType.path: {
                                const path = instruction as PathInstruction;
                                const def = path.points.map((point, i) => {
                                    return `${i === 0 ? "M" : "L"} ${
                                        point[0]
                                    } ${point[1]}`;
                                });
                                return (
                                    <path
                                        key={path.key}
                                        fill="none"
                                        d={def.join(" ")}
                                        stroke={path.styles.color}
                                        strokeWidth={path.styles.thickness}
                                    />
                                );
                            }
                            case InstructionType.circle: {
                                const circle = instruction as CircleInstruction;
                                return (
                                    <circle
                                        key={circle.key}
                                        cx={circle.x}
                                        cy={circle.y}
                                        r={circle.radius}
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
                                        x={text.x}
                                        y={text.y}
                                        style={{
                                            fontFamily: text.styles.font,
                                            fontSize: text.styles.size,
                                            alignItems: text.styles.align,
                                            justifyContent: text.styles.justify,
                                        }}
                                    >
                                        <Text content={text.value} />
                                    </foreignObject>
                                );
                            }
                            case InstructionType.curve: {
                                const curve = instruction as CurveInstruction;
                                const def: string[] = [];

                                const points = getControlPoints(
                                    curve.points[0],
                                    curve.points[1],
                                    curve.points[2]
                                );
                                const [P0, P1, P2, P3, P4, P5] = points;

                                def.push(`M ${P0.x} ${P0.y}`);
                                def.push(`Q ${P1.x} ${P1.y}, ${P2.x} ${P2.y}`);
                                def.push(`L ${P3.x} ${P3.y}`);
                                def.push(`Q ${P4.x} ${P4.y}, ${P5.x} ${P5.y}`);

                                return (
                                    <path
                                        key={curve.key}
                                        fill={curve.styles.color}
                                        d={def.join(" ")}
                                    />
                                );

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
                            default:
                                return null;
                        }
                    })}
                </svg>
            </div>
        </div>
    );
});
