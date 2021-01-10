import { LineInstruction, buildLine } from "../render/line";
import { VerticalSpacing } from "./measure-verical-spacing";
import { VerticalSpans } from "./measure-vertical-spans";

export function drawSubBrackets(x: number, y: number, spacing: VerticalSpacing, spans: VerticalSpans) {
  // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
  // subbrace if same instrument type next to each other

  const left = x - 1.5;
  const styles = { color: "#000000", thickness: 0.125 };

  return spans.subBrackets.reduce((out: LineInstruction[], bracket) => {
    const start = spacing.instruments[bracket.start];
    const stop = spacing.instruments[bracket.stop];

    const top = y + start.y;
    const bottom = y + stop.y + stop.height;

    out.push(buildLine(`${bracket.start}-bracket`, styles, [x, top], [left, top], [left, bottom], [x, bottom]));

    return out;
  }, []);
}
