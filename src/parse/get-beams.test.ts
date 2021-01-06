import { ClefDrawType } from "../store/entries/clef/defs";
import { TimeSignature, TimeSignatureDrawType } from "../store/entries/time-signature/defs";
import { Tone } from "../store/entries/tone/defs";
import { create_flow } from "../store/score-flow/utils";
import { create_stave } from "../store/score-stave/utils";
import { insert_entry } from "../store/score-track/utils";
import { getBarlines } from "./get-barlines";
import { getWrittenDurations } from "./get-written-durations";
import { debugBeams } from "../debug/debug-beams";
import { getBeamsInTrack } from "./get-beams";
import { create_time_signature } from "../store/entries/time-signature/utils";
import { create_tone } from "../store/entries/tone/utils";
import { Accidental, Articulation, NoteDuration } from "../store/entries/defs";

function parse(length: number, time: TimeSignature, tones: Tone[]) {
  const flow = create_flow();
  flow.length = length;
  insert_entry(flow.master, time, true);
  const barlines = getBarlines(flow);
  const stave = create_stave("stave", { lines: [1], clef: { draw_as: ClefDrawType.C, pitch: 60, offset: 0 } });
  const track = stave.tracks.by_key[stave.tracks.order[0]];
  tones.forEach((tone) => {
    insert_entry(track, tone, false);
  });
  const staves = [stave];
  const notation = getWrittenDurations(staves, flow, barlines);
  const beams = getBeamsInTrack(flow, notation[track.key], barlines);
  return debugBeams(length, beams);
}

describe("getBeams (Full bars: simple)", () => {
  it("beams full bar 4/8", () => {
    const s = 4;
    const result = parse(s * 8, create_time_signature(0, 4, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
      create_tone(0, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 2, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 3, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 4, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 5, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 6, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 7, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("+---+---+---+...+---+---+---+...");
  });
  it("beams full bar 5/8", () => {
    const e = 8;
    const result = parse(e * 5, create_time_signature(0, 5, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
      create_tone(0, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 2, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 4, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("+-------+-------+.......+-------+.......");
  });
  it("beams full bar 6/8", () => {
    const e = 8;
    const result = parse(e * 6, create_time_signature(0, 6, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
      create_tone(0, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 2, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 4, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 5, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("+-------+-------+.......+-------+-------+.......");
  });
  it("beams full bar 7/8", () => {
    const e = 8;
    const result = parse(e * 7, create_time_signature(0, 7, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
      create_tone(0, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 2, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 4, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 5, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 6, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("+-------+-------+.......+-------+-------+-------+.......");
  });
  it("beams full bar 4/4", () => {
    const e = 8;
    const result = parse(e * 8, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
      create_tone(0, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 2, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 4, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 5, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 6, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 7, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("+-------+-------+-------+.......+-------+-------+-------+.......");
  });
  it("beams full bar 5/4", () => {
    const e = 8;
    const result = parse(e * 10, create_time_signature(0, 5, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
      create_tone(0, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 2, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 4, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 5, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 6, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 7, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 8, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 9, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("+-------+-------+-------+-------+-------+.......+-------+-------+-------+.......");
  });
  it("beams full bar 6/4", () => {
    const e = 8;
    const result = parse(e * 12, create_time_signature(0, 6, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
      create_tone(0, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 2, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 4, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 5, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 6, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 7, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 8, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 9, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 10, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 11, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe(
      "+-------+-------+-------+-------+-------+.......+-------+-------+-------+-------+-------+......."
    );
  });
  it("beams full bar 2/2", () => {
    const e = 8;
    const result = parse(e * 8, create_time_signature(0, 2, NoteDuration.Half, TimeSignatureDrawType.Regular), [
      create_tone(0, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 2, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 4, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 5, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 6, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 7, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("+-------+-------+-------+.......+-------+-------+-------+.......");
  });
  it("beams full bar 3/2", () => {
    const e = 8;
    const result = parse(e * 12, create_time_signature(0, 2, NoteDuration.Half, TimeSignatureDrawType.Regular), [
      create_tone(0, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 2, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 4, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 5, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 6, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 7, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 8, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 9, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 10, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 11, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe(
      "+-------+-------+-------+.......+-------+-------+-------+.......+-------+-------+-------+......."
    );
  });
  it("beams full bar sixteenths 4/4", () => {
    const s = 4;
    const result = parse(s * 16, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
      create_tone(0, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 2, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 3, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 4, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 5, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 6, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 7, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 8, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 9, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 10, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 11, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 12, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 13, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 14, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 15, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("+---+---+---+...+---+---+---+...+---+---+---+...+---+---+---+...");
  });
});

// FIXME: These are actually wrong. we can span the whole bar when 2/4 + 3/4 as long as it doesn't look like 6/8!
describe("getBeam (full bar: beat groupings exceptions)", () => {
  it("beams full bar 2/4", () => {
    const e = 8;
    const result = parse(e * 4, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
      create_tone(0, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 2, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("+-------+.......+-------+.......");
  });
  it("beams full bar 3/4", () => {
    const e = 8;
    const result = parse(e * 6, create_time_signature(0, 3, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
      create_tone(0, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 2, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 4, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 5, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("+-------+.......+-------+.......+-------+.......");
  });
});

describe("getBeams (Varying rhythms)", () => {
  it("various 2/4", () => {
    const e = 8;
    const result = parse(e * 4, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
      create_tone(e, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 2, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("................+-------+.......");
  });
  it("various 2/4", () => {
    const t = 2;
    const s = 4;
    const e = 8;
    const result = parse(e * 4, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
      create_tone(0, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(1 * e, t * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(7 * t, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),

      create_tone(8 * t, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(9 * t, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(10 * t, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(11 * t, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(12 * t, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("+-------+-----+.+-+-+-+-+.......");
  });
  it("various 3/4", () => {
    const e = 8;
    const result = parse(e * 12, create_time_signature(0, 3, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
      create_tone(0, e * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 4, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 5, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 6, e * 2, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 8, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 9, e * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe(
      "................................+-------+.......................+-------+......................."
    );
  });
  it("various 6/8", () => {
    const e = 8;
    const result = parse(e * 12, create_time_signature(0, 6, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
      create_tone(0, e * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 3, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 4, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 5, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 6, e * 2, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 8, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(e * 9, e * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe(
      "........................+-------+-------+......................................................."
    );
  });
  it("various 6/8", () => {
    const t = 2;
    const s = 4;
    const e = 8;
    const result = parse(e * 6, create_time_signature(0, 6, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
      create_tone(0, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 1, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 2, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 3, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 4, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 5, s, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),

      create_tone(s * 6, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 6 + t, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 7, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 7 + t, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 8, e, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 10, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 10 + t, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 11, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
      create_tone(s * 11 + t, t, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    ]);
    expect(result).toBe("+---+---+---+---+---+...+-+-+-+-+-------+-+-+-+.");
  });
});
