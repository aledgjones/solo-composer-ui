import { buildBox } from "../render/box";
import { Instruction } from "../render/instructions";
import { Flow } from "../store/score-flow/defs";
import { HorizontalSpacing } from "./measure-tick";
import { measureWidthUpto } from "./measure-width-upto";

export function debugTick(
  x: number,
  y: number,
  flow: Flow,
  horizontal_spacing: { [tick: number]: HorizontalSpacing },
  staveHeight: number
) {
  const instructions: Instruction<any>[] = [];
  const colors = [
    "rgba(255,0,255,.2)", //
    "rgba(0,255,255,.2)", //
    "rgba(255,0,255,.2)", //
    "rgba(255,0,0,.2)", //
    "rgba(0,255,0,.2)",
    "rgba(255,0,255,.2)", //
    "rgba(255,0,0,.2)",
    "rgba(0,255,0,.2)",
    "rgba(0,0,255,.2)",
    "rgba(255,0,0,.2)",
    "rgba(0,255,0,.2)",
  ];
  let left = x;
  for (let tick = 0; tick < flow.length; tick++) {
    horizontal_spacing[tick].forEach((width, i) => {
      if (i !== 9 && width > 0) {
        instructions.push(
          buildBox(
            `${tick}-${i}-DEBUG`,
            { color: colors[i] },
            left,
            y,
            width,
            staveHeight
          )
        );
      }
      left = left + width;
    });
  }
  return instructions;
}
