import { NoteDuration } from "../store/entries/defs";
import { duration_to_ticks } from "../store/entries/time-signature/utils";

export function getIsBeamable(duration: number, subdivisions: number) {
  const min = duration_to_ticks(NoteDuration.Eighth, subdivisions);
  return duration <= min;
}
