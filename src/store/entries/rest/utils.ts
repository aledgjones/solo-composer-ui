import { NoteDuration } from "../defs";
import { Align, buildText, Justify, TextStyles } from "../../../render/text";
import { getBaseDuration } from "../../../parse/notation-track";

export function glyphFromDuration(baseLength?: NoteDuration) {
  switch (baseLength) {
    case NoteDuration.ThirtySecond:
      return "\u{E4E8}";
    case NoteDuration.Sixteenth:
      return "\u{E4E7}";
    case NoteDuration.Eighth:
      return "\u{E4E6}";
    case NoteDuration.Quarter:
      return "\u{E4E5}";
    case NoteDuration.Half:
      return "\u{E4E4}";
    case NoteDuration.Whole:
      return "\u{E4E3}";
    default:
      return undefined;
  }
}

export function drawRest(
  x: number,
  y: number,
  duration: number,
  subdivisions: number,
  isFullBar: boolean,
  key: string
) {
  const styles: TextStyles = {
    color: "#000000",
    justify: Justify.Start,
    align: Align.Middle,
    size: 4,
    font: `Bravura`,
  };
  if (isFullBar) {
    return buildText(key, styles, x, y - 1, "\u{E4E3}");
  } else {
    const baseDuration = getBaseDuration(duration, subdivisions);
    const glyph = glyphFromDuration(baseDuration);
    return buildText(key, styles, x, y - (baseDuration === NoteDuration.Whole ? 1 : 0), glyph);
  }
}
