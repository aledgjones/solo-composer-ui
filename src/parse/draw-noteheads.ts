import { Instruction } from "../render/instructions";
import { Align, buildText, Justify, TextStyles } from "../render/text";
import { Tone } from "../store/entries/tone/defs";
import { glyphFromDuration } from "../store/entries/tone/utils";
import { Stave } from "../store/score-stave/defs";
import { Shunts } from "./get-notehead-shunts";
import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { HorizontalOffsets, WidthOf } from "./measure-horizonal-offsets";
import { VerticalSpacing } from "./measure-verical-spacing";
import { getBaseDuration, NotationTracks } from "./notation-track";

export function drawNotehead(
  tick: number,
  x: number,
  y: number,
  duration: number,
  offset: number,
  shunt: WidthOf,
  subdivisions: number,
  horizontalOffsets: HorizontalOffsets,
  tone: Tone
) {
  const instructions: Instruction<any>[] = [];
  const styles: TextStyles = {
    color: "#000000",
    justify: Justify.Start,
    align: Align.Middle,
    size: 4,
    font: `Bravura`,
    lineHeight: 0.25,
  };

  const left = x + horizontalOffsets.get(tick)[shunt];
  const baseDuration = getBaseDuration(duration, subdivisions);
  const glyph = glyphFromDuration(baseDuration);
  const top = y + offset / 2;

  instructions.push(buildText(`notehead-${tick}-${tone.key}`, styles, left, top, glyph, tone, "notehead"));

  return instructions;
}

export function drawNoteheads(
  x: number,
  y: number,
  staves: Stave[],
  notation: NotationTracks,
  horizontalOffsets: HorizontalOffsets,
  verticalSpacing: VerticalSpacing,
  toneVerticalOffsets: ToneVerticalOffsets,
  shunts: Shunts,
  subdivisions: number
) {
  const instructions: Instruction<any>[] = [];

  staves.forEach((stave) => {
    const top = y + verticalSpacing.staves[stave.key].y;
    stave.tracks.order.forEach((trackKey) => {
      const track = notation[trackKey];
      const ticks = Object.keys(track).map((t) => parseInt(t));
      ticks.forEach((tick) => {
        const entry = track[tick];
        entry.tones.forEach((tone) => {
          instructions.push(
            ...drawNotehead(
              tick,
              x,
              top,
              entry.duration,
              toneVerticalOffsets.get(tone.key),
              shunts.get(`${tick}-${tone.key}`),
              subdivisions,
              horizontalOffsets,
              tone
            )
          );
        });
      });
    });
  });

  return instructions;
}
