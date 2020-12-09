import { Pitch, Articulation, EntryType, NoteDuration } from "../defs";
import shortid from "shortid";
import { Tone } from "./defs";
import { Align, buildText, Justify, TextStyles } from "../../../render/text";
import { Instruction } from "../../../render/instructions";
import { getNotationBaseDuration } from "../../../parse/notation-track";

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
  const styles: TextStyles = {
    color: "#000000",
    justify: Justify.Start,
    align: Align.Middle,
    size: 4,
    font: `Bravura`,
  };
  const baseDuration = getNotationBaseDuration(duration, subdivisions);
  const glyph = glyphFromDuration(baseDuration);
  return buildText(`${key}-head`, styles, x, y + offset / 2, glyph);
}
