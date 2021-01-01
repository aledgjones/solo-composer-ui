import { Accidental, Articulation } from "../store/entries/defs";
import { create_tone } from "../store/entries/tone/utils";
import { getNoteheadShuntsInChord } from "./get-notehead-shunts";
import { StemDirectionType } from "./get-stem-directions";
import { WidthOf } from "./measure-width-upto";

describe("getNoteheadShuntsInChord", () => {
  it("no shunts (1 tone, up)", () => {
    const result = getNoteheadShuntsInChord(
      {
        duration: 16,
        tones: [create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a")],
        ties: [],
      },
      new Map([["a", 0]]),
      StemDirectionType.Up
    );
    expect(result).toStrictEqual(new Map([["a", WidthOf.NoteSlot]]));
  });
  it("no shunts (1 tone, down)", () => {
    const result = getNoteheadShuntsInChord(
      {
        duration: 16,
        tones: [create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a")],
        ties: [],
      },
      new Map([["a", 0]]),
      StemDirectionType.Down
    );
    expect(result).toStrictEqual(new Map([["a", WidthOf.NoteSlot]]));
  });
  it("no shunts (2 tones, up)", () => {
    const result = getNoteheadShuntsInChord(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        ],
        ties: [],
      },
      new Map([
        ["a", 0],
        ["b", -1],
      ]),
      StemDirectionType.Up
    );
    expect(result).toStrictEqual(
      new Map([
        ["a", WidthOf.NoteSlot],
        ["b", WidthOf.PostNoteSlot],
      ])
    );
  });
  it("no shunts (2 tones, down)", () => {
    const result = getNoteheadShuntsInChord(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
        ],
        ties: [],
      },
      new Map([
        ["a", 0],
        ["b", -1],
      ]),
      StemDirectionType.Down
    );
    expect(result).toStrictEqual(
      new Map([
        ["a", WidthOf.PreNoteSlot],
        ["b", WidthOf.NoteSlot],
      ])
    );
  });
  it("no shunts (3 tones, up)", () => {
    const result = getNoteheadShuntsInChord(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
          create_tone(0, 16, { int: 64, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
        ],
        ties: [],
      },
      new Map([
        ["a", 0],
        ["b", -1],
        ["c", -2],
      ]),
      StemDirectionType.Up
    );
    expect(result).toStrictEqual(
      new Map([
        ["a", WidthOf.NoteSlot],
        ["b", WidthOf.PostNoteSlot],
        ["c", WidthOf.NoteSlot],
      ])
    );
  });
  it("no shunts (3 tones, down)", () => {
    const result = getNoteheadShuntsInChord(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
          create_tone(0, 16, { int: 64, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
        ],
        ties: [],
      },
      new Map([
        ["a", 0],
        ["b", -1],
        ["c", -2],
      ]),
      StemDirectionType.Down
    );
    expect(result).toStrictEqual(
      new Map([
        ["a", WidthOf.NoteSlot],
        ["b", WidthOf.PreNoteSlot],
        ["c", WidthOf.NoteSlot],
      ])
    );
  });
  it("no shunts (3 tones, 2 clusters, up)", () => {
    const result = getNoteheadShuntsInChord(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
          create_tone(0, 16, { int: 65, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
        ],
        ties: [],
      },
      new Map([
        ["a", 0],
        ["b", -1],
        ["c", -3],
      ]),
      StemDirectionType.Up
    );
    expect(result).toStrictEqual(
      new Map([
        ["a", WidthOf.NoteSlot],
        ["b", WidthOf.PostNoteSlot],
        ["c", WidthOf.NoteSlot],
      ])
    );
  });
  it("no shunts (3 tones, 2 clusters, down)", () => {
    const result = getNoteheadShuntsInChord(
      {
        duration: 16,
        tones: [
          create_tone(0, 16, { int: 60, accidental: Accidental.Natural }, 90, Articulation.None, "a"),
          create_tone(0, 16, { int: 62, accidental: Accidental.Natural }, 90, Articulation.None, "b"),
          create_tone(0, 16, { int: 65, accidental: Accidental.Natural }, 90, Articulation.None, "c"),
        ],
        ties: [],
      },
      new Map([
        ["a", 0],
        ["b", -1],
        ["c", -3],
      ]),
      StemDirectionType.Down
    );
    expect(result).toStrictEqual(
      new Map([
        ["a", WidthOf.PreNoteSlot],
        ["b", WidthOf.NoteSlot],
        ["c", WidthOf.NoteSlot],
      ])
    );
  });
});
