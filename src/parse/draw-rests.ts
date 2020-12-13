import { Instruction } from "../render/instructions";
import { EngravingConfig } from "../store/defs";
import { drawRest } from "../store/entries/rest/utils";
import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";
import { HorizontalSpacing } from "./measure-tick";
import { VerticalSpacing } from "./measure-verical-spacing";
import { measureWidthUpto, WidthOf } from "./measure-width-upto";
import { NotationTracks } from "./notation-track";

export function drawRests(
  x: number,
  y: number,
  staves: Stave[],
  notation: NotationTracks,
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  verticalSpacing: VerticalSpacing,
  barlines: Set<number>,
  flow: Flow,
  engraving: EngravingConfig
) {
  const instructions: Instruction<any>[] = [];

  staves.forEach((stave) => {
    const top = y + verticalSpacing.staves[stave.key].y;
    stave.tracks.order.forEach((trackKey) => {
      const track = notation[trackKey];
      const ticks = Object.keys(track).map((t) => parseInt(t));
      ticks.forEach((tick) => {
        const entry = track[tick];

        if (entry.tones.length === 0) {
          const isFullBar =
            (barlines.has(tick) && barlines.has(tick + entry.duration)) || tick + entry.duration === flow.length;
          const left = x + measureWidthUpto(horizontalSpacing, 0, tick, WidthOf.NoteSlot);
          instructions.push(
            drawRest(left, top, entry.duration, flow.subdivisions, isFullBar, engraving, `rest-${trackKey}-${tick}`)
          );
        }
      });
    });
  });

  return instructions;
}
