import { buildCircle } from "../render/circle";
import { Instruction } from "../render/instructions";
import { Stave } from "../store/score-stave/defs";
import { DotsByTrack } from "./get-dot-slots";
import { Shunts } from "./get-notehead-shunts";
import { HorizontalOffsets } from "./measure-horizonal-offsets";
import { VerticalSpacing } from "./measure-verical-spacing";
import { Notation, NotationTracks } from "./notation-track";

export function drawDot(
  tick: number,
  x: number,
  y: number,
  offset: number,
  shunts: Shunts,
  entry: Notation,
  horizontalOffsets: HorizontalOffsets,
  key: string
) {
  const maxWidthOf = Math.max(...entry.tones.map((tone) => shunts.get(`${tick}-${tone.key}`)));
  const left = x + horizontalOffsets.get(tick)[maxWidthOf + 1];
  const top = y + offset / 2;
  return buildCircle(key, { color: "#000000" }, left + 0.75, top, 0.2);
}

export function drawDots(
  x: number,
  y: number,
  staves: Stave[],
  notation: NotationTracks,
  dots: DotsByTrack,
  shunts: Shunts,
  horizontalOffsets: HorizontalOffsets,
  verticalSpacing: VerticalSpacing
) {
  const instructions: Instruction<any>[] = [];

  staves.forEach((stave) => {
    const top = y + verticalSpacing.staves[stave.key].y;
    stave.tracks.order.forEach((trackKey) => {
      const dotsInTrack = dots[trackKey];
      const notationTrack = notation[trackKey];
      dotsInTrack.forEach((offsets, tick) => {
        offsets.forEach((offset) => {
          instructions.push(
            drawDot(
              tick,
              x,
              top,
              offset,
              shunts,
              notationTrack[tick],
              horizontalOffsets,
              `dot-${trackKey}-${tick}-${offset}`
            )
          );
        });
      });
    });
  });

  return instructions;
}
