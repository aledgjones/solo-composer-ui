import { FC } from "react";
import { merge } from "../../ui";
import { useParseWorker } from "./use-parse-worker";
import { Instruction, InstructionType } from "../../render/instructions";
import { LineInstruction } from "../../render/line";
import { CircleInstruction } from "../../render/circle";
import { TextInstruction } from "../../render/text";
import { CurveInstruction, getControlPoints } from "../../render/curve";
import { useStore } from "../../store/use-store";
import { BoxInstruction } from "../../render/box";
import { Entry } from "../../store/entries/defs";
import { ShapeInstruction } from "../../render/shape";

import "./styles.css";
import { TextRenderer } from "./text-renderer";
import { LineRenderer } from "./line-renderer";
import { CircleRenderer } from "./circle-renderer";
import { CurveRenderer } from "./curve-renderer";
import { BoxRenderer } from "./box-renderer";
import { ShapeRenderer } from "./shape-renderer";

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
                return <LineRenderer key={instruction.key} path={instruction as LineInstruction} space={space} />;
              }

              case InstructionType.Circle: {
                return <CircleRenderer key={instruction.key} circle={instruction as CircleInstruction} space={space} />;
              }

              case InstructionType.Text: {
                return (
                  <TextRenderer
                    key={instruction.key}
                    text={instruction as TextInstruction}
                    space={space}
                    selection={selection}
                    onSelect={onSelect}
                  />
                );
              }

              case InstructionType.Curve: {
                return <CurveRenderer key={instruction.key} curve={instruction as CurveInstruction} space={space} />;
              }

              case InstructionType.Box: {
                return <BoxRenderer key={instruction.key} box={instruction as BoxInstruction} space={space} />;
              }

              case InstructionType.Shape: {
                return <ShapeRenderer key={instruction.key} path={instruction as ShapeInstruction} space={space} />;
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
