import { AbsoluteTempo } from "./defs";
import { NoteDuration, DottedValue, EntryType } from "../defs";
import shortid from "shortid";
import { EngravingConfig } from "../../score-engraving/defs";
import { Align, buildText, TextStyles } from "../../../render/text";

export function create_absolute_tempo(
  tick: number,
  text: string,
  beat_type: NoteDuration,
  dotted: DottedValue,
  bpm: number,
  parenthesis_visible: boolean,
  text_visible: boolean,
  bpm_visible: boolean
): AbsoluteTempo {
  return {
    key: shortid(),
    tick,
    type: EntryType.AbsoluteTempo,
    text,
    beat_type,
    dotted,
    bpm,
    parenthesis_visible,
    text_visible,
    bpm_visible,
  };
}

function calculate_dot(duration: number, dotted: DottedValue) {
  switch (dotted) {
    case DottedValue.Single:
      return duration / 2;
    case DottedValue.Double:
      return duration / 2 + duration / 4;
    default:
      return 0;
  }
}

export function normalize_bpm(time_signature: AbsoluteTempo): number {
  let base = 1;
  switch (time_signature.beat_type) {
    case NoteDuration.Whole:
      base = 4;
      break;
    case NoteDuration.Half:
      base = 2;
      break;
    case NoteDuration.Quarter:
      base = 1;
      break;
    case NoteDuration.Eighth:
      base = 0.5;
      break;
    case NoteDuration.Sixteenth:
      base = 0.25;
      break;
    case NoteDuration.ThirtySecond:
      base = 0.125;
      break;
    default:
      base = 1;
      break;
  }
  const duration = base + calculate_dot(base, time_signature.dotted);
  return time_signature.bpm * duration;
}

export function durationFromString(str: string) {
  switch (str) {
    case "w":
      return NoteDuration.Whole;
    case "h":
      return NoteDuration.Half;
    case "q":
      return NoteDuration.Quarter;
    case "e":
      return NoteDuration.Eighth;
    case "s":
      return NoteDuration.Sixteenth;
    case "t":
      return NoteDuration.ThirtySecond;
    default:
      break;
  }
}

function glyphFromDuration(duration?: NoteDuration) {
  switch (duration) {
    case NoteDuration.Whole:
      return "${whole}";
    case NoteDuration.Half:
      return "${half}";
    case NoteDuration.Quarter:
      return "${quarter}";
    case NoteDuration.Eighth:
      return "${eighth}";
    case NoteDuration.Sixteenth:
      return "${sixteenth}";
    case NoteDuration.ThirtySecond:
      return "${thirtysecond}";
    default:
      return "";
  }
}

export function drawAbsoluteTempo(x: number, y: number, tempo: AbsoluteTempo, config: EngravingConfig) {
  const styles: TextStyles = {
    color: "#000000",
    font: config.tempo.font,
    size: config.tempo.size,
    justify: config.tempo.align,
    align: Align.Bottom,
    lineHeight: 1,
  };

  let left = x;
  let top = y - config.tempo.distanceFromStave - config.tempo.size;
  let output = [];

  if (tempo.text_visible && tempo.text) {
    output.push(`${tempo.text} `);
  }

  if (tempo.bpm_visible) {
    // open parens
    if (tempo.parenthesis_visible) {
      output.push("(");
    }

    output.push(glyphFromDuration(tempo.beat_type));

    // dotted
    if (tempo.dotted > 0) {
      for (let i = 0; i < tempo.dotted; i++) {
        output.push(" ${dot}");
      }
    }

    // equation
    output.push(` = ${tempo.bpm}`);

    // close parens
    if (tempo.parenthesis_visible) {
      output.push(")");
    }
  }

  return buildText(tempo.key, styles, left, top, output.join(""));
}
