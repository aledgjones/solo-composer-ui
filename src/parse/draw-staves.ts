import { VerticalSpacing } from "./measure-verical-spacing";
import { LineInstruction, buildLine } from "../render/line";
import { Stave } from "../store/score-stave/defs";

export function drawStaves(x: number, y: number, width: number, staves: Stave[], verticalSpacing: VerticalSpacing) {
  const paths: LineInstruction[] = [];
  const styles = { color: "#000000", thickness: 0.125 };

  // render staves
  staves.forEach((stave) => {
    for (let i = 0; i < stave.lines.length; i++) {
      if (stave.lines[i] === 1) {
        const start = y + (verticalSpacing.staves[stave.key].y - verticalSpacing.staves[stave.key].height / 2) + i;
        paths.push(buildLine(`${stave.key}-stave-${i}`, styles, [x, start], [x + width, start]));
      }
    }
  });

  return paths;
}
