import { NoteDuration } from "../store/entries/defs";
import { getBaseDuration, getIsDotted } from "./notation-track";

function getNoteSpaceScalingFromNoteDuration(base: NoteDuration, spacingRatio: number) {
  switch (base) {
    case NoteDuration.ThirtySecond:
      return spacingRatio / 8;
    case NoteDuration.Sixteenth:
      return spacingRatio / 4;
    case NoteDuration.Eighth:
      return spacingRatio / 2;
    case NoteDuration.Quarter:
      return 1;
    case 2:
      return spacingRatio;
    case 4:
      return spacingRatio * 2;
    default:
      1;
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
