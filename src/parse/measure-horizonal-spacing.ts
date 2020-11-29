import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";
import { HorizontalSpacing, measureTick } from "./measure-tick";
import { NotationTracks } from "./notation-track";

export function measureHorizontalSpacing(staves: Stave[], flow: Flow, barlines: Set<number>, notation: NotationTracks) {
  const spacing: { [tick: number]: HorizontalSpacing } = {};
  let width = 0.0;

  for (let tick = 0; tick < flow.length; tick++) {
    spacing[tick] = measureTick(tick, staves, flow, barlines.has(tick), notation);
    width += spacing[tick].reduce((out, w) => out + w, 0.0);
  }
  return { horizontalSpacing: spacing, width };
}
