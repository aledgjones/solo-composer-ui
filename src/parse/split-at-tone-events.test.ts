import { create_track, insert_entry } from "../store/score-track/utils";
import { create_tone } from "../store/entries/tone/utils";
import { Articulation } from "../store/entries/defs";
import { splitAtToneEvents } from "./split-at-tone-events";
import { pitchFromNumber } from "../store/entries/utils";

describe("Notate Tones", () => {
  it("Creates tone, rest and null entries", () => {
    const c = 4;
    const len = c * 4;

    const track = create_track();
    insert_entry(track, create_tone(0, c * 2, pitchFromNumber(60), 80, Articulation.None));
    const notation = splitAtToneEvents(len, track);

    expect(Object.keys(notation).length).toBe(2);
    expect(notation[0].tones.length).toBe(1);
    expect(notation[0].ties.length).toBe(0);
    expect(notation[c * 2].tones.length).toBe(0);
    expect(notation[c * 2].ties.length).toBe(0);
  });

  it("Creates tone, rest and null entries", () => {
    const c = 4;
    const len = c * 4;

    const track = create_track();
    insert_entry(track, create_tone(0, c * 3, pitchFromNumber(60), 80, Articulation.None));
    insert_entry(track, create_tone(c, c * 2, pitchFromNumber(62), 80, Articulation.None));
    const notation = splitAtToneEvents(len, track);

    expect(Object.keys(notation).length).toBe(3);
    expect(notation[0].tones.length).toBe(1);
    expect(notation[0].ties.length).toBe(1);
    expect(notation[c].tones.length).toBe(2);
    expect(notation[c].ties.length).toBe(0);
    expect(notation[c * 3].tones.length).toBe(0);
  });
});
