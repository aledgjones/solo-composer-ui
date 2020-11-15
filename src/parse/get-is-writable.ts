import { NotationBaseDuration } from "./notation-track";

function isWritable(duration: number, subdivisions: number) {
  switch (duration / subdivisions) {
    case NotationBaseDuration.Sixteenth:
    case NotationBaseDuration.Eighth:
    case NotationBaseDuration.Quarter:
    case NotationBaseDuration.Half:
    case NotationBaseDuration.Whole:
      return true;
    default:
      return false;
  }
}

export function getIsWritable(duration: number, subdivisions: number) {
  let writable = isWritable(duration, subdivisions);
  if (!writable) {
    writable = isWritable((duration / 3) * 2, subdivisions);
  }
  return writable;
}
