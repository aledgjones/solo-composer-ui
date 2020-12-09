import { HorizontalSpacing } from "./measure-tick";
import { WidthOf } from "./sum-width-up-to";

export function measureWidthUpto(
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  tick: number,
  WidthOf: WidthOf
) {
  let width = 0.0;
  for (let i = 0; i <= tick; i++) {
    if (i < tick) {
      width += horizontalSpacing[i].reduce((out, w) => out + w, 0.0);
    } else if (i === tick) {
      for (let ii = 0; ii < WidthOf; ii++) {
        width += horizontalSpacing[i][ii];
      }
      break;
    }
  }
  return width;
}
