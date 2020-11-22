import { Flow } from "../store/score-flow/defs";
import { Instrument } from "../store/score-instrument/defs";
import { Player } from "../store/score-player/defs";
import { HorizontalSpacing, measureTick } from "./measure-tick";
import { NotationTracks } from "./notation-track";

export function measureHorizontalSpacing(
  players: { order: string[]; by_key: { [key: string]: Player } },
  instruments: { [key: string]: Instrument },
  flow: Flow,
  barlines: Set<number>,
  notation: NotationTracks
) {
  const spacing: { [tick: number]: HorizontalSpacing } = {};
  let width = 0.0;

  for (let tick = 0; tick < flow.length; tick++) {
    spacing[tick] = measureTick(
      tick,
      players,
      instruments,
      flow,
      barlines.has(tick),
      notation
    );
    width += spacing[tick].reduce((out, w) => out + w, 0.0);
  }
  return { horizontalSpacing: spacing, width };
}
