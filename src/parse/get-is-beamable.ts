import { NoteDuration } from "../store/entries/defs";
import { duration_to_ticks } from "../store/entries/time-signature/utils";
import { getBaseDuration } from "./notation-track";

export function getIsBeamable(duration: number, subdivisions: number) {
  const min = duration_to_ticks(NoteDuration.Eighth, subdivisions);
  const baseDuration = getBaseDuration(duration, subdivisions);
  const ticks = duration_to_ticks(baseDuration, subdivisions);
  return ticks <= min;
}
