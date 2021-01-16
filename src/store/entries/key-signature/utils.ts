import { KeySignature, KeySignatureMode, key_signature_patterns } from "./defs";
import { Box, EntryType, Accidental } from "../defs";
import shortid from "shortid";
import { Clef } from "../clef/defs";
import { TextStyles, Justify, Align, buildText } from "../../../render/text";

export function measureKeySignatureBox(entry: KeySignature): Box {
  const width = entry.offset < 0 ? entry.offset * -1 : entry.offset;
  return { width, height: 4 };
}

export function measureKeySignatureBounds(entry: KeySignature): Box {
  const width = entry.offset < 0 ? entry.offset * -1 : entry.offset;
  const padding = width > 0 ? 1 : 0;
  return { width: width + padding, height: 4 };
}

export function createKeySignature(tick: number, mode: KeySignatureMode, offset: number): KeySignature {
  return {
    type: EntryType.KeySignature,
    key: shortid(),
    tick: tick,

    mode,
    offset,
  };
}

export function glyphFromAccidentalType(type: Accidental) {
  switch (type) {
    case Accidental.DoubleFlat:
      return "\u{E264}";
    case Accidental.Flat:
      return "\u{E260}";
    case Accidental.Sharp:
      return "\u{E262}";
    case Accidental.DoubleSharp:
      return "\u{E263}";
    case Accidental.Natural:
    default:
      return "\u{E261}";
  }
}

export function drawKeySignature(x: number, y: number, clef: Clef, key: KeySignature, staveKey: string) {
  const instructions = [];

  const styles: TextStyles = {
    color: "#000000",
    font: "Bravura",
    size: 4,
    justify: Justify.Start,
    align: Align.Middle,
    lineHeight: 0.5,
  };

  // calc naturals here - find out rules for naturalising

  if (key.offset < 0) {
    const glyph = glyphFromAccidentalType(Accidental.Flat);
    const pattern = key_signature_patterns[clef.draw_as][clef.offset][Accidental.Flat];
    for (let i = 0; i > key.offset; i--) {
      instructions.push(
        buildText(`${key.key}-${staveKey}-${i}`, styles, x + i * -1, y + 0.5 * (pattern[i * -1] * -1), glyph)
      );
    }
  }

  if (key.offset > 0) {
    const glyph = glyphFromAccidentalType(Accidental.Sharp);
    const pattern = key_signature_patterns[clef.draw_as][clef.offset][Accidental.Sharp];
    for (let i = 0; i < key.offset; i++) {
      instructions.push(buildText(`${key.key}-${staveKey}-${i}`, styles, x + i, y + 0.5 * (pattern[i] * -1), glyph));
    }
  }

  return instructions;
}
