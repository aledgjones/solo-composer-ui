import { ClefDrawType } from "../store/entries/clef/defs";
import { Accidental, Articulation, NoteDuration } from "../store/entries/defs";
import { TimeSignature, TimeSignatureDrawType } from "../store/entries/time-signature/defs";
import { create_time_signature } from "../store/entries/time-signature/utils";
import { Tone } from "../store/entries/tone/defs";
import { create_tone } from "../store/entries/tone/utils";
import { create_flow } from "../store/score-flow/utils";
import { create_stave } from "../store/score-stave/utils";
import { insert_entry } from "../store/score-track/utils";
import { getBarlines } from "./get-barlines";
import { getBeamsInTrack } from "./get-beams";
import { getStemDirection, getStemDirectionsInTrack, StemDirectionType } from "./get-stem-directions";
import { getToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { getWrittenDurations } from "./get-written-durations";

describe("getStemDirection", () => {
  it("returns correct stem direction (middle)", () => {
    const result = getStemDirection(
      {
        duration: 16,
        tones: [create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a")],
        ties: [],
      },
      new Map([["a", 0]])
    );
    expect(result).toBe(StemDirectionType.Down);
  });
  it("returns correct stem direction (high)", () => {
    const result = getStemDirection(
      {
        duration: 16,
        tones: [create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a")],
        ties: [],
      },
      new Map([["a", 2]])
    );
    expect(result).toBe(StemDirectionType.Up);
  });
  it("returns correct stem direction (low)", () => {
    const result = getStemDirection(
      {
        duration: 16,
        tones: [create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a")],
        ties: [],
      },
      new Map([["a", -2]])
    );
    expect(result).toBe(StemDirectionType.Down);
  });
  it("returns correct stem direction (equal distance)", () => {
    const result = getStemDirection(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        ],
        ties: [],
      },
      new Map([
        ["a", -2],
        ["b", 2],
      ])
    );
    expect(result).toBe(StemDirectionType.Down);
  });
  it("returns correct stem direction (highest furthest)", () => {
    const result = getStemDirection(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        ],
        ties: [],
      },
      new Map([
        ["a", -2],
        ["b", 3],
      ])
    );
    expect(result).toBe(StemDirectionType.Up);
  });
  it("returns correct stem direction (highest furthest, ignores inner notes)", () => {
    const result = getStemDirection(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "d"),
        ],
        ties: [],
      },
      new Map([
        ["a", -2],
        ["b", 3],
        ["c", -7],
      ])
    );
    expect(result).toBe(StemDirectionType.Down);
  });
});

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
  const toneVerticalOffsets = getToneVerticalOffsets(flow, staves);
  const beams = getBeamsInTrack(flow, notation[track.key], barlines);
  return getStemDirectionsInTrack(notation[track.key], toneVerticalOffsets, beams);
}

describe("getStemDirectionsInTrack", () => {
  it("works with a scale", () => {
    const q = 16;
    const result = parse(q * 4, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.CommonTime), [
      create_tone(0, q, { int: 57, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
      create_tone(q, q, { int: 59, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
      create_tone(q * 2, q, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
      create_tone(q * 3, q, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "d"),
    ]);
    expect(result).toStrictEqual(
      new Map([
        [0, StemDirectionType.Up],
        [16, StemDirectionType.Up],
        [32, StemDirectionType.Down],
        [48, StemDirectionType.Down],
      ])
    );
  });
  it("works with beamings (more up than down)", () => {
    const e = 8;
    const result = parse(e * 8, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.CommonTime), [
      create_tone(0, e * 2, { int: 57, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
      create_tone(e * 2, e * 2, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
      create_tone(e * 4, e, { int: 55, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
      create_tone(e * 5, e, { int: 57, accidental: Accidental.Natural }, 90, Articulation.None, "d"),
      create_tone(e * 6, e, { int: 57, accidental: Accidental.Natural }, 90, Articulation.None, "e"),
      create_tone(e * 7, e, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "f"),
    ]);
    expect(result).toStrictEqual(
      new Map([
        [0, StemDirectionType.Up],
        [16, StemDirectionType.Down],
        [32, StemDirectionType.Up],
        [40, StemDirectionType.Up],
        [48, StemDirectionType.Up],
        [56, StemDirectionType.Up],
      ])
    );
  });
  it("works with beamings (more down than up)", () => {
    const e = 8;
    const result = parse(e * 8, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.CommonTime), [
      create_tone(0, e * 2, { int: 57, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
      create_tone(e * 2, e * 2, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
      create_tone(e * 4, e, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
      create_tone(e * 5, e, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "d"),
      create_tone(e * 6, e, { int: 64, accidental: Accidental.Natural }, 90, Articulation.None, "e"),
      create_tone(e * 7, e, { int: 55, accidental: Accidental.Natural }, 90, Articulation.None, "f"),
    ]);
    expect(result).toStrictEqual(
      new Map([
        [0, StemDirectionType.Up],
        [16, StemDirectionType.Down],
        [32, StemDirectionType.Down],
        [40, StemDirectionType.Down],
        [48, StemDirectionType.Down],
        [56, StemDirectionType.Down],
      ])
    );
  });
  it("works with beamings (equal up and down, one note further than others)", () => {
    const e = 8;
    const result = parse(e * 8, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.CommonTime), [
      create_tone(0, e * 2, { int: 57, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
      create_tone(e * 2, e * 2, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
      create_tone(e * 4, e, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
      create_tone(e * 5, e, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "d"),
      create_tone(e * 6, e, { int: 50, accidental: Accidental.Natural }, 90, Articulation.None, "e"),
      create_tone(e * 7, e, { int: 55, accidental: Accidental.Natural }, 90, Articulation.None, "f"),
    ]);
    expect(result).toStrictEqual(
      new Map([
        [0, StemDirectionType.Up],
        [16, StemDirectionType.Down],
        [32, StemDirectionType.Up],
        [40, StemDirectionType.Up],
        [48, StemDirectionType.Up],
        [56, StemDirectionType.Up],
      ])
    );
  });
  it("works with beamings (equal up and down, equal distance from middle)", () => {
    const e = 8;
    const result = parse(e * 8, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.CommonTime), [
      create_tone(0, e * 2, { int: 57, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
      create_tone(e * 2, e * 2, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
      create_tone(e * 4, e, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
      create_tone(e * 5, e, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "d"),
      create_tone(e * 6, e, { int: 59, accidental: Accidental.Natural }, 90, Articulation.None, "e"),
      create_tone(e * 7, e, { int: 59, accidental: Accidental.Natural }, 90, Articulation.None, "f"),
    ]);
    expect(result).toStrictEqual(
      new Map([
        [0, StemDirectionType.Up],
        [16, StemDirectionType.Down],
        [32, StemDirectionType.Down],
        [40, StemDirectionType.Down],
        [48, StemDirectionType.Down],
        [56, StemDirectionType.Down],
      ])
    );
  });
});
