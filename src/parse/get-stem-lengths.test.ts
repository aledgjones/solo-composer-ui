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
      { a: 0 },
      StemDirectionType.Down
    );
    expect(result).toStrictEqual({ length: 3.25, offset: 0.25 });
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
      { a: 3, b: -2 },
      StemDirectionType.Up
    );
    expect(result).toStrictEqual({ length: 5.75, offset: 1.25 });
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
      { a: -3, b: 2 },
      StemDirectionType.Down
    );
    expect(result).toStrictEqual({ length: 5.75, offset: -1.25 });
  });
  it("is at least 3.5 (up)", () => {
    const result = getStemLength(
      {
        duration: 16,
        tones: [create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a")],
        ties: [],
      },
      { a: 0 },
      StemDirectionType.Up
    );
    expect(result).toStrictEqual({ length: 3.25, offset: -0.25 });
  });
  it("is extends from center (down)", () => {
    const result = getStemLength(
      {
        duration: 16,
        tones: [create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a")],
        ties: [],
      },
      { a: -10 },
      StemDirectionType.Down
    );
    expect(result).toStrictEqual({ length: 4.75, offset: -4.75 });
  });
  it("is extends from center (up)", () => {
    const result = getStemLength(
      {
        duration: 16,
        tones: [create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a")],
        ties: [],
      },
      { a: 10 },
      StemDirectionType.Up
    );
    expect(result).toStrictEqual({ length: 4.75, offset: 4.75 });
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
      { a: -11, b: -13 },
      StemDirectionType.Down
    );
    expect(result).toStrictEqual({ length: 6.25, offset: -6.25 });
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
      { a: 11, b: 13 },
      StemDirectionType.Up
    );
    expect(result).toStrictEqual({ length: 6.25, offset: 6.25 });
  });
});
