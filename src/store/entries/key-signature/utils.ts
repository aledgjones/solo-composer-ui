import { KeySignature, KeySignatureMode, key_signature_patterns } from "./defs";
import { Box, EntryType, Accidental, pitch_to_parts } from "..";
import shortid from "shortid";
import { Clef } from "../clef";
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

export function createKeySignature(
  tick: number,
  mode: KeySignatureMode,
  offset: number
): KeySignature {
  // convert to positive number
  const width = offset < 0 ? offset * -1 : offset;
  const padding = width > 0 ? 1 : 0;
  return {
    type: EntryType.KeySignature,
    key: shortid(),
    tick: tick,

    mode,
    offset,
  };
}

function glyphFromType(type: Accidental) {
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

export function drawKeySignature(
  x: number,
  y: number,
  clef: Clef,
  key: KeySignature,
  staveKey: string
) {
  const instructions = [];

  const styles: TextStyles = {
    color: "#000000",
    font: "Music",
    size: 4,
    justify: Justify.Start,
    align: Align.Middle,
  };

  // calc naturals here - find out rules for naturalising

  if (key.offset < 0) {
    const glyph = glyphFromType(Accidental.Flat);
    const clef_pitch = pitch_to_parts(clef.pitch)[0];
    const pattern =
      key_signature_patterns[clef_pitch][clef.offset][Accidental.Flat];
    for (let i = 0; i > key.offset; i--) {
      instructions.push(
        buildText(
          `${key.key}-${staveKey}-${i}`,
          styles,
          x + i * -1,
          y + 0.5 * pattern[i * -1],
          glyph
        )
      );
    }
  }

  if (key.offset > 0) {
    const glyph = glyphFromType(Accidental.Sharp);
    const clef_pitch = pitch_to_parts(clef.pitch)[0];
    const pattern =
      key_signature_patterns[clef_pitch][clef.offset][Accidental.Sharp];
    for (let i = 0; i < key.offset; i++) {
      instructions.push(
        buildText(
          `${key.key}-${staveKey}-${i}`,
          styles,
          x + i,
          y + 0.5 * pattern[i],
          glyph
        )
      );
    }
  }

  return instructions;
}
