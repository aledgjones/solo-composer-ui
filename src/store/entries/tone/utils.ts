import { Pitch, Articulation, EntryType, NoteDuration } from "../defs";
import shortid from "shortid";
import { Tone } from "./defs";
import { Align, buildText, Justify, TextStyles } from "../../../render/text";
import { getBaseDuration, getIsDotted } from "../../../parse/notation-track";
import { Instruction } from "../../../render/instructions";
import { buildCircle } from "../../../render/circle";

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
  x: number,
  y: number,
  duration: number,
  offset: number,
  subdivisions: number,
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
  const baseDuration = getBaseDuration(duration, subdivisions);
  const isDotted = getIsDotted(duration, subdivisions);
  const glyph = glyphFromDuration(baseDuration);
  const top = y + offset / 2;

  instructions.push(buildText(`${key}-head`, styles, x, top, glyph));
  if (isDotted) {
    instructions.push(
      buildCircle(`${key}-dot`, { color: "#000000" }, x + 1.75, top + (Math.abs(offset) % 2 > 0 ? 0 : -0.5), 0.25)
    );
  }

  return instructions;
}
