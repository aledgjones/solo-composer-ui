import { Pitch, Articulation, EntryType, NoteDuration } from "../defs";
import shortid from "shortid";
import { Tone } from "./defs";
import { Align, buildText, Justify, TextStyles } from "../../../render/text";
import { getBaseDuration, getIsDotted, Notation } from "../../../parse/notation-track";
import { Instruction } from "../../../render/instructions";
import { buildCircle } from "../../../render/circle";
import { measureWidthUpto, WidthOf } from "../../../parse/measure-width-upto";
import { HorizontalSpacing } from "../../../parse/measure-tick";
import { Shunts } from "../../../parse/get-notehead-shunts";

export function create_tone(
  tick: number,
  duration: number,
  pitch: Pitch,
  velocity: number,
  articulation: Articulation,
  key: string = shortid()
): Tone {
  return {
    key,
    tick,
    type: EntryType.Tone,
    duration,
    pitch,
    velocity,
    articulation,
  };
}

export function widthFromDuration(duration: number, subdevisions: number) {
  const baseLength = getBaseDuration(duration, subdevisions);
  switch (baseLength) {
    case NoteDuration.ThirtySecond:
    case NoteDuration.Sixteenth:
    case NoteDuration.Eighth:
    case NoteDuration.Quarter:
      return 1.175;
    case NoteDuration.Half:
      return 1.18;
    case NoteDuration.Whole:
      return 1.695;
    default:
      return undefined;
  }
}

export function glyphFromDuration(baseLength?: NoteDuration) {
  switch (baseLength) {
    case NoteDuration.ThirtySecond:
    case NoteDuration.Sixteenth:
    case NoteDuration.Eighth:
    case NoteDuration.Quarter:
      return "\u{E0A4}";
    case NoteDuration.Half:
      return "\u{E0A3}";
    case NoteDuration.Whole:
      return "\u{E0A2}";
    default:
      return undefined;
  }
}

export function drawNotehead(
  tick: number,
  x: number,
  y: number,
  duration: number,
  offset: number,
  shunt: WidthOf,
  subdivisions: number,
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  key: string
) {
  const instructions: Instruction<any>[] = [];
  const styles: TextStyles = {
    color: "#000000",
    justify: Justify.Start,
    align: Align.Middle,
    size: 4,
    font: `Bravura`,
  };

  const left = x + measureWidthUpto(horizontalSpacing, 0, tick, shunt);
  const baseDuration = getBaseDuration(duration, subdivisions);
  const glyph = glyphFromDuration(baseDuration);
  const top = y + offset / 2;

  instructions.push(buildText(`${key}-head`, styles, left, top, glyph));

  return instructions;
}

export function drawDot(
  tick: number,
  x: number,
  y: number,
  offset: number,
  shunts: Shunts,
  entry: Notation,
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  key: string
) {
  const maxWidthOf = Math.max(...entry.tones.map((tone) => shunts.get(tone.key)));
  const left = x + measureWidthUpto(horizontalSpacing, 0, tick, maxWidthOf + 1);
  const top = y + offset / 2;
  return buildCircle(`${key}-dot`, { color: "#000000" }, left + 0.75, top, 0.25);
}
