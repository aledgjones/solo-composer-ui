import { Barline, BarlineDrawType } from "../store/entries/barline/defs";
import { KeySignature } from "../store/entries/key-signature/defs";
import { TimeSignature } from "../store/entries/time-signature/defs";

export interface BarlineDrawDef {
  endRepeat: boolean;
  startRepeat: boolean;
  draw_type: BarlineDrawType | undefined;
}

export function getBarlineDrawTypeAtTick(
  tick: number,
  key: KeySignature,
  time: TimeSignature,
  barline: Barline,
  isFirstBeat: boolean
) {
  const barlines: BarlineDrawDef = {
    endRepeat: false,
    startRepeat: false,
    draw_type: undefined,
  };

  // don't draw first barline
  if (tick === 0) {
    return barlines;
  }

  // non-explicit barlines (vetoed by explicit barlies)
  if (!barline) {
    if (key || time) {
      barlines.draw_type = BarlineDrawType.Double;
    } else if (isFirstBeat) {
      barlines.draw_type = BarlineDrawType.Normal;
    }
  }

  // if there is an explicit barline
  if (barline) {
    switch (barline.draw_type) {
      case BarlineDrawType.StartRepeat:
        barlines.startRepeat = true;
        break;
      case BarlineDrawType.EndRepeat:
        barlines.endRepeat = true;
        break;
      case BarlineDrawType.EndStartRepeat: {
        // draw together if no time/key
        if (!key && !time) {
          barlines.draw_type = BarlineDrawType.EndStartRepeat;
        } else {
          // draw seperate if there are items to fit between
          barlines.startRepeat = true;
          barlines.endRepeat = true;
        }
        break;
      }
      default:
        barlines.draw_type = barline.draw_type;
        break;
    }
  }

  return barlines;
}
