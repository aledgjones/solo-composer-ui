import { Instruction } from "../render/instructions";
import { buildPath } from "../render/path";
import { VerticalSpacing } from "./measure-verical-spacing";
import { measureWidthUpto, WidthOf } from "./measure-width-upto";
import { HorizontalSpacing } from "./measure-tick";
import { Stave } from "../store/score-stave/defs";
import { StemDirectionsByTrack, StemDirectionType } from "./get-stem-directions";
import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { getBaseDuration, NotationTracks } from "./notation-track";
import { Flow } from "../store/score-flow/defs";

export function drawStems(
  x: number,
  y: number,
  flow: Flow,
  staves: Stave[],
  notation: NotationTracks,
  toneVerticalOffsets: ToneVerticalOffsets,
  stemDirections: StemDirectionsByTrack,
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  verticalSpacing: VerticalSpacing
) {
  const instructions: Instruction<any>[] = [];

  const width = 0.125;

  staves.forEach((stave) => {
    stave.tracks.order.forEach((trackKey) => {
      const track = notation[trackKey];
      const directions = stemDirections[trackKey];
      directions.forEach((direction, tick) => {
        const entry = track[tick];
        // only draw stems if duration < whole
        if (getBaseDuration(entry.duration, flow.subdivisions) > 1) {
          const offsets = entry.tones.map((tone) => toneVerticalOffsets[tone.key]);
          const max = Math.max(...offsets);
          const min = Math.min(...offsets);
          const start = (direction === StemDirectionType.Up ? max - 0.5 : min + 0.5) / 2;
          const stop = (direction === StemDirectionType.Up ? min - 7 : max + 7) / 2;

          const left =
            x +
            measureWidthUpto(
              horizontalSpacing,
              0,
              tick,
              direction === StemDirectionType.Up ? WidthOf.NoteSpacing : WidthOf.NoteSlot
            ) +
            (width / 2) * (direction === StemDirectionType.Up ? -1 : 1);
          instructions.push(
            buildPath(
              `stem-${trackKey}-${tick}`,
              { color: "#000000", thickness: width },
              [left, y + verticalSpacing.staves[stave.key].y + start],
              [left, y + verticalSpacing.staves[stave.key].y + stop]
            )
          );
        }
      });
    });
  });

  return instructions;
}
