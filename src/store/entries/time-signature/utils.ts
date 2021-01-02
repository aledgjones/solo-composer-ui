import shortid from "shortid";
import { NoteDuration, EntryType, Box } from "../defs";
import { TimeSignatureDrawType, TimeSignature, TimeSignatureType } from "./defs";
import { Track } from "../../score-track/defs";
import { Align, buildText, Justify, TextStyles } from "../../../render/text";
import { Flow } from "../../score-flow/defs";

export function measureTimeSignatureBox(entry: TimeSignature): Box {
  const isWide = entry.beats > 9 || entry.beat_type > 9;
  const isHidden = entry.draw_type === TimeSignatureDrawType.Hidden;
  return { width: isHidden ? 0 : isWide ? 3 : 1.7, height: 4 };
}

export function measureTimeSignatureBounds(entry: TimeSignature): Box {
  const isWide = entry.beats > 9 || entry.beat_type > 9;
  const isHidden = entry.draw_type === TimeSignatureDrawType.Hidden;
  return { width: isHidden ? 0 : (isWide ? 3 : 1.7) + 2, height: 4 };
}

/** Create a time signature with optional beat groupings */
export function create_time_signature(
  tick: number,
  beats: number,
  beat_type: NoteDuration,
  draw_type: TimeSignatureDrawType,
  groupings?: number[]
): TimeSignature {
  return {
    key: shortid(),
    tick,
    type: EntryType.TimeSignature,
    beats,
    beat_type,
    draw_type,
    groupings: groupings || default_groupings(beats),
  };
}

export function kind_from_beats(beats: number): TimeSignatureType {
  if (beats == 0) {
    return TimeSignatureType.Open;
  } else if (beats > 3 && beats % 3 == 0) {
    return TimeSignatureType.Compound;
  } else if (beats == 1 || beats == 2 || beats == 3 || beats == 4) {
    return TimeSignatureType.Simple;
  } else {
    return TimeSignatureType.Complex;
  }
}

function glyph_from_digit(val: string) {
  switch (val) {
    case "0":
      return "\u{E080}";
    case "1":
      return "\u{E081}";
    case "2":
      return "\u{E082}";
    case "3":
      return "\u{E083}";
    case "4":
      return "\u{E084}";
    case "5":
      return "\u{E085}";
    case "6":
      return "\u{E086}";
    case "7":
      return "\u{E087}";
    case "8":
      return "\u{E088}";
    case "9":
      return "\u{E089}";
    default:
      return "\u{E08A}";
  }
}

function glyph_from_number(val: number) {
  const parts = val.toString().split("");
  return parts.map((part) => glyph_from_digit(part)).join("");
}

function glyph_from_type(val: NoteDuration) {
  switch (val) {
    case NoteDuration.Whole:
      return glyph_from_number(1);
    case NoteDuration.Half:
      return glyph_from_number(2);
    case NoteDuration.Quarter:
      return glyph_from_number(4);
    case NoteDuration.Eighth:
      return glyph_from_number(8);
    case NoteDuration.Sixteenth:
      return glyph_from_number(16);
    case NoteDuration.ThirtySecond:
      return glyph_from_number(32);
    default:
      break;
  }
}

export function default_groupings(beats: number): number[] {
  if (beats > 0 && beats <= 3) {
    return Array(beats).fill(1);
  } else {
    switch (kind_from_beats(beats)) {
      case TimeSignatureType.Simple:
        return Array(beats / 2).fill(2);
      case TimeSignatureType.Compound:
        return Array(beats / 3).fill(3);
      case TimeSignatureType.Complex: {
        const out = [];
        let remaining = beats;
        while (remaining > 4) {
          out.push(3);
          remaining = remaining - 3;
        }
        out.push(remaining);
        return out;
      }
      case TimeSignatureType.Open:
        return [2, 2];
    }
  }
}

export function duration_to_ticks(duration: NoteDuration, subdivisions: number) {
  switch (duration) {
    case NoteDuration.Whole:
      return subdivisions * 4;
    case NoteDuration.Half:
      return subdivisions * 2;
    case NoteDuration.Quarter:
      return subdivisions;
    case NoteDuration.Eighth:
      return subdivisions / 2;
    case NoteDuration.Sixteenth:
      return subdivisions / 4;
    case NoteDuration.ThirtySecond:
      return subdivisions / 8;
    default:
      return subdivisions;
  }
}

export function distance_from_barline(tick: number, subdivisions: number, time_signature: TimeSignature) {
  if (kind_from_beats(time_signature.beats) === TimeSignatureType.Open) {
    return tick - time_signature.tick;
  } else {
    const ticks_per_bar = duration_to_ticks(time_signature.beat_type, subdivisions) * time_signature.beats;
    return (tick - time_signature.tick) % ticks_per_bar;
  }
}

export function is_on_beat_type(
  tick: number,
  subdivisions: number,
  time_signature: TimeSignature,
  beat_type: NoteDuration
) {
  if (kind_from_beats(time_signature.beats) === TimeSignatureType.Open) {
    return tick === time_signature.tick;
  } else {
    const ticks_per_beat_type = duration_to_ticks(beat_type, subdivisions);
    return (tick - time_signature.tick) % ticks_per_beat_type === 0;
  }
}

export function is_on_grouping_boundry(tick: number, subdivisions: number, time_signature: TimeSignature) {
  if (kind_from_beats(time_signature.beats) === TimeSignatureType.Open) {
    return tick === time_signature.tick;
  } else {
    let ticks_per_beat = duration_to_ticks(time_signature.beat_type, subdivisions);
    let bar_length = ticks_per_beat * time_signature.beats;
    let distance_from_first_beat = (tick - time_signature.tick) % bar_length;

    if (distance_from_first_beat === 0) {
      return true;
    }

    let offset = 0;
    time_signature.groupings.forEach((group) => {
      offset += group * ticks_per_beat;
      if (distance_from_first_beat == offset) {
        return true;
      }
    });

    return false;
  }
}

export function get_entries_at_tick(tick: number, track: Track, type: EntryType) {
  const entries = track.entries.by_tick[tick] || [];
  return entries.map((key) => track.entries.by_key[key]).filter((entry) => entry.type === type);
}

export function get_entry_before_tick(_tick: number, track: Track, type: EntryType, inclusive: boolean) {
  // it is not possible to have entries before tick 0
  if (_tick === 0 && !inclusive) {
    return null;
  }
  for (let tick = _tick - (inclusive ? 0 : 1); tick >= 0; tick--) {
    const entries = track.entries.by_tick[tick] || [];
    const filtered = entries.map((key) => track.entries.by_key[key]).filter((entry) => entry.type === type);
    if (filtered.length > 0) {
      return filtered[0];
    }
  }
  return null;
}

export function get_entry_after_tick(_tick: number, flow: Flow, track: Track, type: EntryType, inclusive: boolean) {
  for (let tick = _tick + (inclusive ? 0 : 1); tick < flow.length; tick++) {
    const entries = track.entries.by_tick[tick] || [];
    const filtered = entries.map((key) => track.entries.by_key[key]).filter((entry) => entry.type === type);
    if (filtered.length > 0) {
      return filtered[0];
    }
  }
  return null;
}

export function drawTimeSignature(x: number, y: number, time: TimeSignature, staveKey: string) {
  const instructions = [];
  const styles: TextStyles = {
    color: "#000000",
    font: "Bravura",
    size: 4,
    justify: Justify.Middle,
    align: Align.Middle,
  };

  const box = measureTimeSignatureBox(time);
  const left = x + box.width / 2;

  switch (time.draw_type) {
    case TimeSignatureDrawType.Hidden:
      break;
    case TimeSignatureDrawType.CommonTime:
      instructions.push(buildText(`${time.key}-${staveKey}`, styles, left, y, "\u{E08A}"));
      break;
    case TimeSignatureDrawType.CutCommonTime:
      instructions.push(buildText(`${time.key}-${staveKey}`, styles, left, y, "\u{E08B}"));
      break;
    case TimeSignatureDrawType.Open:
      instructions.push(buildText(`${time.key}-${staveKey}`, styles, left, y, "\u{E09C}"));
      break;
    case TimeSignatureDrawType.Regular:
    default:
      const countGlyph = glyph_from_number(time.beats);
      const beatGlyph = glyph_from_type(time.beat_type);
      instructions.push(buildText(`${time.key}-${staveKey}-count`, styles, left, y - 1, countGlyph));
      instructions.push(buildText(`${time.key}-${staveKey}-beat`, styles, left, y + 1, beatGlyph));
      break;
  }

  return instructions;
}
