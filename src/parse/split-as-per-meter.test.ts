import { debugNotationTrack } from "../debug/debug-notation-track";
import { ClefDrawType } from "../store/entries/clef/defs";
import { Accidental, Articulation, NoteDuration } from "../store/entries/defs";
import { TimeSignature, TimeSignatureDrawType } from "../store/entries/time-signature/defs";
import { create_time_signature } from "../store/entries/time-signature/utils";
import { Tone } from "../store/entries/tone/defs";
import { create_tone } from "../store/entries/tone/utils";
import { create_flow } from "../store/score-flow/utils";
import { create_stave } from "../store/score-stave/utils";
import { insert_entry } from "../store/score-track/utils";
import { getFirstBeats } from "./get-first-beats";
import { getWrittenDurations } from "./get-written-durations";

function parse(length: number, time: TimeSignature, tones: Tone[]) {
  const flow = create_flow();
  flow.length = length;
  insert_entry(flow.master, time, true);
  const barlines = getFirstBeats(flow);
  const stave = create_stave("stave", { lines: [1], clef: { draw_as: ClefDrawType.C, pitch: 60, offset: 0 } });
  const track = stave.tracks.by_key[stave.tracks.order[0]];
  tones.forEach((tone) => {
    insert_entry(track, tone, false);
  });
  const staves = [stave];
  const notation = getWrittenDurations(staves, flow, barlines);
  return debugNotationTrack(flow.length, notation[track.key]);
}

it("splits notes at barlines only - 2/4", () => {
  const c = 16;
  const len = c * 4;
  const log = parse(len, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, len, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o_______________________________o------------------------------¬");
});

it("splits rests at barlines only - 2/4", () => {
  const c = 16;
  const len = c * 4;

  const log = parse(len, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), []);

  expect(log).toBe("r------------------------------¬r------------------------------¬");
});

// i++;

// it(i + ". " + "renders a full bar rest as such - 2/4", () => {
//   const c = 12;
//   const len = c * 2;

//   const flow = createTrack([createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2) }, 0)]);

//   const track = createTrack([]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar rest as such - 6/8", () => {
//   const q = 6;
//   const len = q * 6;

//   const flow = createTrack([createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6) }, 0)]);

//   const track = createTrack([]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------------------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar rest as such - 3/4", () => {
//   const c = 12;
//   const len = c * 3;

//   const flow = createTrack([createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3) }, 0)]);

//   const track = createTrack([]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------------------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar rest as such - 9/8", () => {
//   const q = 6;
//   const len = q * 9;

//   const flow = createTrack([createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9) }, 0)]);

//   const track = createTrack([]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------------------------------------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar rest as such - 4/4", () => {
//   const c = 12;
//   const len = c * 4;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------------------------------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar rest as such - 12/8", () => {
//   const q = 6;
//   const len = q * 12;

//   const flow = createTrack([createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12) }, 0)]);

//   const track = createTrack([]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------------------------------------------------------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar rest as such - 5/8", () => {
//   const q = 6;
//   const len = q * 5;

//   const flow = createTrack([createTimeSignature({ beats: 5, beatType: 8, groupings: getDefaultGroupings(5) }, 0)]);

//   const track = createTrack([]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar rest as such - 7/8", () => {
//   const q = 6;
//   const len = q * 7;

//   const flow = createTrack([createTimeSignature({ beats: 7, beatType: 8, groupings: getDefaultGroupings(7) }, 0)]);

//   const track = createTrack([]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------------------------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar note as such - 2/4", () => {
//   const c = 12;
//   const len = c * 2;

//   const flow = createTrack([createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: len }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar note as such - 6/8", () => {
//   const q = 6;
//   const len = q * 6;

//   const flow = createTrack([createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: len }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------------------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar note as such - 3/4", () => {
//   const c = 12;
//   const len = c * 3;

//   const flow = createTrack([createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: len }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------------------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar note as such - 9/8", () => {
//   const q = 6;
//   const len = q * 9;

//   const flow = createTrack([createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: len }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o___________________________________o----------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar note as such - 4/4", () => {
//   const c = 12;
//   const len = c * 4;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: len }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------------------------------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar note as such - 12/8", () => {
//   const q = 6;
//   const len = q * 12;

//   const flow = createTrack([createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: len }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------------------------------------------------------------------¬");
// });

// i++;

// it(i + ". " + "renders a full bar note as such - 5/8", () => {
//   const q = 6;
//   const len = q * 5;

//   const flow = createTrack([createTimeSignature({ beats: 5, beatType: 8, groupings: getDefaultGroupings(5) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: len }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o_________________o----------¬");
// });

// i++;

// it(i + ". " + "renders a full bar note as such - 7/8", () => {
//   const q = 6;
//   const len = q * 7;

//   const flow = createTrack([createTimeSignature({ beats: 7, beatType: 8, groupings: getDefaultGroupings(7) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: len }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o_________________o----------------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [c---]", () => {
//   const c = 12;
//   const len = c * 4;

//   const flow = createTrack([createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: c * 1 }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------¬r----------¬r----------------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [c--c]", () => {
//   const c = 12;
//   const len = c * 4;

//   const flow = createTrack([createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: c * 1 }, 0),
//     createTone({ pitch: "C4", duration: c * 1 }, c * 3),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------¬r----------¬r----------¬o----------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [---c]", () => {
//   const c = 12;
//   const len = c * 4;

//   const flow = createTrack([createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: c * 1 }, c * 3)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------------------¬r----------¬o----------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 6/8 [q-----]", () => {
//   const q = 6;
//   const len = q * 6;

//   const flow = createTrack([createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: q * 1 }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----¬r----¬r----¬r----------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 6/8 [c--c]", () => {
//   const q = 6;
//   const len = q * 6;

//   const flow = createTrack([createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 2 }, 0),
//     createTone({ pitch: "C4", duration: q * 2 }, q * 4),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------¬r----¬r----¬o----------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 6/8 [-----q]", () => {
//   const q = 6;
//   const len = q * 6;

//   const flow = createTrack([createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: q * 1 }, q * 5)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------------¬r----¬r----¬o----¬");
// });

// i++;

// it(i + ". " + "renders correctly - 12/8 [q-----------]", () => {
//   const q = 6;
//   const len = q * 12;

//   const flow = createTrack([createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: q * 1 }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----¬r----¬r----¬r----------------¬r----------------------------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 12/8 [q----------q]", () => {
//   const q = 6;
//   const len = q * 12;

//   const flow = createTrack([createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 1 }, 0),
//     createTone({ pitch: "C4", duration: q * 1 }, q * 11),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----¬r----¬r----¬r----------------¬r----------------¬r----¬r----¬o----¬");
// });

// i++;

// it(i + ". " + "renders correctly - 12/8 [-----------q]", () => {
//   const q = 6;
//   const len = q * 12;

//   const flow = createTrack([createTimeSignature({ beats: 12, beatType: 8, groupings: getDefaultGroupings(12) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: q * 1 }, q * 11)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------------------------------¬r----------------¬r----¬r----¬o----¬");
// });

// i++;

// it(i + ". " + "renders correctly - 3/4 [c--]", () => {
//   const c = 12;
//   const len = c * 3;

//   const flow = createTrack([createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: c * 1 }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------¬r----------¬r----------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 3/4 [--c]", () => {
//   const c = 12;
//   const len = c * 3;

//   const flow = createTrack([createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: c * 1 }, c * 2)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------¬r----------¬o----------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 9/8 [c.------]", () => {
//   const q = 6;
//   const len = q * 9;

//   const flow = createTrack([createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: q * 3 }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------------¬r----------------¬r----------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 9/8 [------c.]", () => {
//   const q = 6;
//   const len = q * 9;

//   const flow = createTrack([createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: q * 3 }, q * 6)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------------¬r----------------¬o----------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 2/4 [----s]", () => {
//   const sq = 3;
//   const len = sq * 8;

//   const flow = createTrack([createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: sq * 1 }, sq * 7)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------¬r-------¬o-¬");
// });

// i++;

// it(i + ". " + "renders correctly - 6/8 [c_ss---]", () => {
//   const sq = 3;
//   const len = sq * 12;

//   const flow = createTrack([createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: sq * 5 }, 0),
//     createTone({ pitch: "C4", duration: sq }, sq * 5),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o___________o-¬o-¬r----------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 2/4 [qcq]", () => {
//   const q = 6;
//   const len = q * 4;

//   const flow = createTrack([createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 1 }, 0),
//     createTone({ pitch: "C4", duration: q * 2 }, q * 1),
//     createTone({ pitch: "C4", duration: q * 1 }, q * 3),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----¬o----------¬o----¬");
// });

// i++;

// it(i + ". " + "renders correctly - 2/4 [sq._c]", () => {
//   const sq = 3;
//   const len = sq * 8;

//   const flow = createTrack([createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: sq * 1 }, 0),
//     createTone({ pitch: "C4", duration: sq * 7 }, sq * 1),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o-¬o________o----------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 3/4 [m_qq]", () => {
//   const q = 6;
//   const len = q * 6;

//   const flow = createTrack([createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 5 }, 0),
//     createTone({ pitch: "C4", duration: q * 1 }, q * 5),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o_______________________o----¬o----¬");
// });

// i++;

// it(i + ". " + "renders correctly - 3/4 [qq_c.q]", () => {
//   const q = 6;
//   const len = q * 6;

//   const flow = createTrack([createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 1 }, 0),
//     createTone({ pitch: "C4", duration: q * 4 }, q * 1),
//     createTone({ pitch: "C4", duration: q * 1 }, q * 5),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----¬o_____o----------------¬o----¬");
// });

// i++;

// it(i + ". " + "renders correctly - 3/4 [c.q_c]", () => {
//   const q = 6;
//   const len = q * 6;

//   const flow = createTrack([createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 3 }, 0),
//     createTone({ pitch: "C4", duration: q * 3 }, q * 3),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------------¬o_____o----------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 3/4 [qq_m]", () => {
//   const q = 6;
//   const len = q * 6;

//   const flow = createTrack([createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 1 }, 0),
//     createTone({ pitch: "C4", duration: q * 5 }, q * 1),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----¬o_____o----------------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 6/8 [qc_c.]", () => {
//   const q = 6;
//   const len = q * 6;

//   const flow = createTrack([createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 1 }, 0),
//     createTone({ pitch: "C4", duration: q * 5 }, q * 1),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----¬o___________o----------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 6/8 [q.s_q_c.]", () => {
//   const sq = 3;
//   const len = sq * 12;

//   const flow = createTrack([createTimeSignature({ beats: 6, beatType: 8, groupings: getDefaultGroupings(6) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: sq * 3 }, 0),
//     createTone({ pitch: "C4", duration: sq * 9 }, sq * 3),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o-------¬o__o_____o----------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 9/8 [m._cq]", () => {
//   const q = 6;
//   const len = q * 9;

//   const flow = createTrack([createTimeSignature({ beats: 9, beatType: 8, groupings: getDefaultGroupings(9) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 8 }, 0),
//     createTone({ pitch: "C4", duration: q * 1 }, q * 8),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o___________________________________o----------¬o----¬");
// });

// i++;

// it(i + ". " + "renders correctly - 2/4 [qc.]", () => {
//   const q = 6;
//   const len = q * 4;

//   const flow = createTrack([createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 1 }, 0),
//     createTone({ pitch: "C4", duration: q * 3 }, q * 1),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----¬o----------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 2/4 [q.q]", () => {
//   const q = 6;
//   const len = q * 4;

//   const flow = createTrack([createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 3 }, 0),
//     createTone({ pitch: "C4", duration: q * 1 }, q * 3),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------------¬o----¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [cm.]", () => {
//   const c = 12;
//   const len = c * 4;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: c * 1 }, 0),
//     createTone({ pitch: "C4", duration: c * 3 }, c * 1),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------¬o----------------------------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [m.c]", () => {
//   const c = 12;
//   const len = c * 4;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: c * 3 }, 0),
//     createTone({ pitch: "C4", duration: c * 1 }, c * 3),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------------------------------¬o----------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [sq._c_m]", () => {
//   const sq = 3;
//   const len = sq * 16;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: sq * 1 }, 0),
//     createTone({ pitch: "C4", duration: sq * 15 }, sq * 1),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o-¬o________o___________o----------------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [qc._qcq]", () => {
//   const q = 6;
//   const len = q * 8;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 1 }, 0),
//     createTone({ pitch: "C4", duration: q * 4 }, q * 1),
//     createTone({ pitch: "C4", duration: q * 2 }, q * 5),
//     createTone({ pitch: "C4", duration: q * 1 }, q * 7),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----¬o_________________o----¬o----------¬o----¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [qqqq_c.q]", () => {
//   const q = 6;
//   const len = q * 8;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 1 }, 0),
//     createTone({ pitch: "C4", duration: q * 1 }, q * 1),
//     createTone({ pitch: "C4", duration: q * 1 }, q * 2),
//     createTone({ pitch: "C4", duration: q * 4 }, q * 3),
//     createTone({ pitch: "C4", duration: q * 1 }, q * 7),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----¬o----¬o----¬o_____o----------------¬o----¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [m_c_q-]", () => {
//   const q = 6;
//   const len = q * 8;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: q * 7 }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o_______________________o___________o----¬r----¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [m.-]", () => {
//   const q = 6;
//   const len = q * 8;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: q * 6 }, 0)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o----------------------------------¬r----------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [m_c.s-]", () => {
//   const q = 6;
//   const sq = 3;
//   const len = q * 8;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 7 }, 0),
//     createTone({ pitch: "C4", duration: sq }, q * 7),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o_______________________o----------------¬o-¬r-¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [m_c.-s]", () => {
//   const q = 6;
//   const sq = 3;
//   const len = q * 8;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: q * 7 }, 0),
//     createTone({ pitch: "C4", duration: sq }, q * 7 + sq),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o_______________________o___________o----¬r-¬o-¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [-m.]", () => {
//   const q = 6;
//   const len = q * 8;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([createTone({ pitch: "C4", duration: q * 6 }, q * 2)]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("r----------¬o----------------------------------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 4/4 [q.sc_c-]", () => {
//   const sq = 3;
//   const q = 6;
//   const len = q * 8;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: sq * 3 }, 0),
//     createTone({ pitch: "C4", duration: sq * 1 }, sq * 3),
//     createTone({ pitch: "C4", duration: q * 4 }, q * 2),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o-------¬o-¬o___________o----------¬r----------¬");
// });

// i++;

// it(i + ". " + "renders correctly - 2/4 [sq._q.s]", () => {
//   const sq = 3;
//   const q = 6;
//   const len = q * 8;

//   const flow = createTrack([createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]);

//   const track = createTrack([
//     createTone({ pitch: "C4", duration: sq }, 0),
//     createTone({ pitch: "C4", duration: sq * 6 }, sq),
//   ]);

//   const log = parse(len, flow, track);

//   expect(log).toBe("o-¬o________o-------¬r-¬r----------------------¬");
// });

// i++;
