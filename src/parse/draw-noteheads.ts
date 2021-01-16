import { Instruction } from "../render/instructions";
import { Align, buildText, Justify, TextStyles } from "../render/text";
import { Tone } from "../store/entries/tone/defs";
import { glyphFromDuration } from "../store/entries/tone/utils";
import { Stave } from "../store/score-stave/defs";
import { Shunts } from "./get-notehead-shunts";
import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { HorizontalSpacing } from "./measure-tick";
import { VerticalSpacing } from "./measure-verical-spacing";
import { measureWidthUpto, WidthOf } from "./measure-width-upto";
import { getBaseDuration, NotationTracks } from "./notation-track";

export function drawNotehead(
  tick: number,
  x: number,
  y: number,
  duration: number,
  offset: number,
  shunt: WidthOf,
  subdivisions: number,
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
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

  const left = x + measureWidthUpto(horizontalSpacing, 0, tick, shunt);
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
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  verticalSpacing: VerticalSpacing,
  toneVerticalOffsets: ToneVerticalOffsets,
  shunts: Shunts,
  subdivisions: number
) {
  const instructions: Instruction<any>[] = [];

  for (let i = 0; i < staves.length; i++) {
    const stave = staves[i];
    const top = y + verticalSpacing.staves[stave.key].y;

    for (let ii = 0; ii < stave.tracks.order.length; ii++) {
      const trackKey = stave.tracks.order[ii];
      const track = notation[trackKey];
      const ticks = Object.keys(track).map((t) => parseInt(t));

      for (let iii = 0; iii < ticks.length; iii++) {
        const tick = ticks[iii];
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
              horizontalSpacing,
              tone
            )
          );
        });
      }
    }
  }

  return instructions;
}
