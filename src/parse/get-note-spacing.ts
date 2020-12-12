import { NoteDuration } from "../store/entries/defs";
import { getBaseDuration, getIsDotted } from "./notation-track";

function getNoteSpaceScalingFromNoteDuration(base: NoteDuration, spacingRatio: number) {
  switch (base) {
    case NoteDuration.ThirtySecond:
      return 1 / (spacingRatio * 4);
    case NoteDuration.Sixteenth:
      return 1 / (spacingRatio * 2);
    case NoteDuration.Eighth:
      return 1 / spacingRatio;
    case NoteDuration.Quarter:
      return 1;
    case NoteDuration.Half:
      return spacingRatio;
    case NoteDuration.Whole:
      return spacingRatio * 2;
    default:
      return 1;
  }
}

export function getNoteSpacing(
  duration: number,
  subdivisions: number,
  quarter_spacing: number,
  minimum_width: number,
  spacing_ratio: number
) {
  const base = getBaseDuration(duration, subdivisions);
  const dotted = getIsDotted(duration, subdivisions);
  const width = quarter_spacing * getNoteSpaceScalingFromNoteDuration(base, spacing_ratio) * (dotted ? 1.2 : 1);
  if (width > minimum_width) {
    return width;
  } else {
    return minimum_width;
  }
}
