import { Instruction } from "../render/instructions";
import { BeamsByTrack } from "./get-beams";
import { VerticalSpacing } from "./measure-verical-spacing";
import { HorizontalSpacing } from "./measure-tick";
import { Stave } from "../store/score-stave/defs";
import { StemDirectionsByTrack, StemDirectionType } from "./get-stem-directions";
import { StemLengthsByTrack } from "./get-stem-lengths";
import { buildShape } from "../render/shape";
import { HorizontalOffsets, WidthOf } from "./measure-horizonal-offsets";

export function drawBeams(
  x: number,
  y: number,
  beams: BeamsByTrack,
  staves: Stave[],
  stemDirections: StemDirectionsByTrack,
  stemLengths: StemLengthsByTrack,
  horizontalOffsets: HorizontalOffsets,
  verticalSpacing: VerticalSpacing,
  experimental: boolean
) {
  const instructions: Instruction<any>[] = [];

  if (experimental) {
    const stemWidth = 0.125;

    staves.forEach((stave) => {
      stave.tracks.order.forEach((trackKey) => {
        const track = beams[trackKey];
        const directions = stemDirections[trackKey];
        const lengths = stemLengths[trackKey];
        track.forEach((beam) => {
          const direction = directions.get(beam[0]);

          const startX =
            x +
            (direction === StemDirectionType.Up
              ? horizontalOffsets.get(beam[0])[WidthOf.PostNoteSlot] - stemWidth
              : horizontalOffsets.get(beam[0])[WidthOf.NoteSlot]);

          const endX =
            x +
            (direction === StemDirectionType.Up
              ? horizontalOffsets.get(beam[beam.length - 1])[WidthOf.PostNoteSlot]
              : horizontalOffsets.get(beam[beam.length - 1])[WidthOf.NoteSlot] + stemWidth);

          const startY =
            y +
            verticalSpacing.staves[stave.key].y +
            lengths.get(beam[0]).tail +
            (direction === StemDirectionType.Up ? 0.25 - stemWidth : -0.25 + stemWidth);
          const endY =
            y +
            verticalSpacing.staves[stave.key].y +
            lengths.get(beam[beam.length - 1]).tail +
            (direction === StemDirectionType.Up ? 0.25 - stemWidth : -0.25 + stemWidth);

          instructions.push(
            buildShape(
              `beam-${trackKey}-${beam[0]}`,
              { color: "#000000" },
              [startX, startY - 0.25],
              [endX, endY - 0.25],
              [endX, endY + 0.25],
              [startX, startY + 0.25]
            )
          );
        });
      });
    });
  }

  return instructions;
}
