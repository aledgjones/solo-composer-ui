import shortid from "shortid";
import { Accidental, Box, EntryType } from "../defs";
import { Align, buildText, Justify, TextStyles } from "../../../render/text";
import { Clef, ClefDrawType } from "./defs";

export function measureClefBox(entry: Clef): Box {
  return { width: 2.8, height: 4 };
}

export function measureClefBounds(entry: Clef): Box {
  return { width: 3.8, height: 4 };
}

export function createClef(tick: number, pitch: number, offset: number, draw_as: ClefDrawType): Clef {
  return {
    type: EntryType.Clef,
    key: shortid(),
    tick,

    pitch: {
      int: pitch,
      accidental: Accidental.Natural,
    },
    offset,
    draw_as,
  };
}

function glyphFromType(type: ClefDrawType) {
  switch (type) {
    case ClefDrawType.Percussion:
      return "\u{E069}";
    case ClefDrawType.C:
      return "\u{E05C}";
    case ClefDrawType.F:
      return "\u{E062}";
    case ClefDrawType.G:
    default:
      return "\u{E050}";
  }
}

export function drawClef(x: number, y: number, clef: Clef) {
  const glyph = glyphFromType(clef.draw_as);
  const styles: TextStyles = {
    color: "#000000",
    justify: Justify.Start,
    align: Align.Middle,
    size: 4,
    font: `Bravura`,
    lineHeight: 1,
  };
  return buildText(clef.key, styles, x, y + 0.5 * (clef.offset * -1), glyph);
}
