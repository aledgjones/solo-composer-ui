import { Accidental, Articulation } from "../store/entries/defs";
import { create_tone } from "../store/entries/tone/utils";
import { StemDirectionType } from "./get-stem-directions";
import { getStemLength } from "./get-stem-lengths";

describe("getStemLength", () => {
  it("is at least 3.5 (down)", () => {
    const result = getStemLength(
      {
        duration: 16,
        tones: [create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a")],
        ties: [],
      },
      new Map([["a", 0]]),
      StemDirectionType.Down
    );
    expect(result).toStrictEqual({ head: 0.25, tail: 3.5 });
  });
  it("is at least 3.5 (up)", () => {
    const result = getStemLength(
      {
        duration: 16,
        tones: [create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a")],
        ties: [],
      },
      new Map([["a", 0]]),
      StemDirectionType.Up
    );
    expect(result).toStrictEqual({ head: -0.25, tail: -3.5 });
  });
  it("is at least 3.5 (up, chord)", () => {
    const result = getStemLength(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        ],
        ties: [],
      },
      new Map([
        ["a", 3],
        ["b", -2],
      ]),
      StemDirectionType.Up
    );
    expect(result).toStrictEqual({ head: 1.25, tail: -4.5 });
  });
  it("is at least 3.5 (down, chord)", () => {
    const result = getStemLength(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        ],
        ties: [],
      },
      new Map([
        ["a", -3],
        ["b", 2],
      ]),
      StemDirectionType.Down
    );
    expect(result).toStrictEqual({ head: -1.25, tail: 4.5 });
  });
  it("is extends from center (down)", () => {
    const result = getStemLength(
      {
        duration: 16,
        tones: [create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a")],
        ties: [],
      },
      new Map([["a", -10]]),
      StemDirectionType.Down
    );
    expect(result).toStrictEqual({ head: -4.75, tail: 0 });
  });
  it("is extends from center (up)", () => {
    const result = getStemLength(
      {
        duration: 16,
        tones: [create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a")],
        ties: [],
      },
      new Map([["a", 10]]),
      StemDirectionType.Up
    );
    expect(result).toStrictEqual({ head: 4.75, tail: 0 });
  });
  it("is extends from center (down, chord)", () => {
    const result = getStemLength(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        ],
        ties: [],
      },
      new Map([
        ["a", -11],
        ["b", -13],
      ]),
      StemDirectionType.Down
    );
    expect(result).toStrictEqual({ head: -6.25, tail: 0 });
  });
  it("is extends from center (up, chord)", () => {
    const result = getStemLength(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        ],
        ties: [],
      },
      new Map([
        ["a", 11],
        ["b", 13],
      ]),
      StemDirectionType.Up
    );
    expect(result).toStrictEqual({ head: 6.25, tail: 0 });
  });
});
