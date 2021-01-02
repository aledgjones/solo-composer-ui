import { Accidental, Articulation } from "../store/entries/defs";
import { create_tone } from "../store/entries/tone/utils";
import { getDotSlotsInTick } from "./get-dot-slots";

it("dotted correctly (D+E)", () => {
  const result = getDotSlotsInTick(
    {
      duration: 16,
      tones: [
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
      ],
      ties: [],
    },
    new Map([
      ["a", 4],
      ["b", 5],
    ])
  );

  expect(result).toStrictEqual(new Set([5, 3]));
});

it("dotted correctly (D+F+A+D)", () => {
  const result = getDotSlotsInTick(
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
      ["a", -3],
      ["b", 1],
      ["c", 3],
      ["d", 5],
    ])
  );

  expect(result).toStrictEqual(new Set([-3, 1, 3, 5]));
});

it("dotted correctly (E+G+A)", () => {
  const result = getDotSlotsInTick(
    {
      duration: 16,
      tones: [
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
      ],
      ties: [],
    },
    new Map([
      ["a", -3],
      ["b", -5],
      ["c", -6],
    ])
  );

  expect(result).toStrictEqual(new Set([-7, -5, -3]));
});

it("dotted correctly (E+F)", () => {
  const result = getDotSlotsInTick(
    {
      duration: 16,
      tones: [
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
      ],
      ties: [],
    },
    new Map([
      ["a", 4],
      ["b", 3],
    ])
  );

  expect(result).toStrictEqual(new Set([5, 3]));
});

it("dotted correctly (D+A+B)", () => {
  const result = getDotSlotsInTick(
    {
      duration: 16,
      tones: [
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
      ],
      ties: [],
    },
    new Map([
      ["a", -2],
      ["b", -6],
      ["c", -7],
    ])
  );

  expect(result).toStrictEqual(new Set([-7, -5, -3]));
});

it("dotted correctly (F+G+A)", () => {
  const result = getDotSlotsInTick(
    {
      duration: 16,
      tones: [
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
      ],
      ties: [],
    },
    new Map([
      ["a", 3],
      ["b", 2],
      ["c", 1],
    ])
  );

  expect(result).toStrictEqual(new Set([3, 1, -1]));
});

it("dotted correctly (E+G+A)", () => {
  const result = getDotSlotsInTick(
    {
      duration: 16,
      tones: [
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
      ],
      ties: [],
    },
    new Map([
      ["a", 4],
      ["b", 2],
      ["c", 1],
    ])
  );

  expect(result).toStrictEqual(new Set([5, 3, 1]));
});

it("dotted correctly (A+B+C+D+E)", () => {
  const result = getDotSlotsInTick(
    {
      duration: 16,
      tones: [
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "d"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "e"),
      ],
      ties: [],
    },
    new Map([
      ["a", 1],
      ["b", 0],
      ["c", -1],
      ["d", -2],
      ["e", -3],
    ])
  );

  expect(result).toStrictEqual(new Set([3, 1, -1, -3, -5]));
});

it("dotted correctly (F+G+A+B)", () => {
  const result = getDotSlotsInTick(
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
      ["a", 3],
      ["b", 2],
      ["c", 1],
      ["d", 0],
    ])
  );

  expect(result).toStrictEqual(new Set([5, 3, 1, -1]));
});

it("dotted correctly (F+G+A+C+D+E+F+G)", () => {
  const result = getDotSlotsInTick(
    {
      duration: 16,
      tones: [
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "d"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "e"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "f"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "g"),
        create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "h"),
      ],
      ties: [],
    },
    new Map([
      ["a", 3],
      ["b", 2],
      ["c", 1],
      ["d", -1],
      ["e", -2],
      ["f", -3],
      ["g", -4],
      ["h", -5],
    ])
  );

  expect(result).toStrictEqual(new Set([3, 1, -1, -3, -5]));
});
