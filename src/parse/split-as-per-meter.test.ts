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
import { getBarlines } from "./get-barlines";
import { getWrittenDurations } from "./get-written-durations";

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
  return debugNotationTrack(notation[track.key]);
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

it("renders a full bar rest as such - 2/4", () => {
  const c = 16;
  const len = c * 2;
  const log = parse(len, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), []);

  expect(log).toBe("r------------------------------¬");
});

it("renders a full bar rest as such - 6/8", () => {
  const q = 8;
  const len = q * 6;
  const log = parse(len, create_time_signature(0, 6, NoteDuration.Eighth, TimeSignatureDrawType.Regular), []);

  expect(log).toBe("r----------------------------------------------¬");
});

it("renders a full bar rest as such - 3/4", () => {
  const c = 16;
  const len = c * 3;
  const log = parse(len, create_time_signature(0, 3, NoteDuration.Quarter, TimeSignatureDrawType.Regular), []);

  expect(log).toBe("r----------------------------------------------¬");
});

it("renders a full bar rest as such - 9/8", () => {
  const q = 8;
  const len = q * 9;
  const log = parse(len, create_time_signature(0, 9, NoteDuration.Eighth, TimeSignatureDrawType.Regular), []);

  expect(log).toBe("r----------------------------------------------------------------------¬");
});

it("renders a full bar rest as such - 4/4", () => {
  const c = 16;
  const len = c * 4;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), []);

  expect(log).toBe("r--------------------------------------------------------------¬");
});

it("renders a full bar rest as such - 12/8", () => {
  const q = 8;
  const len = q * 12;
  const log = parse(len, create_time_signature(0, 12, NoteDuration.Eighth, TimeSignatureDrawType.Regular), []);

  expect(log).toBe("r----------------------------------------------------------------------------------------------¬");
});

it("renders a full bar rest as such - 5/8", () => {
  const q = 8;
  const len = q * 5;
  const log = parse(len, create_time_signature(0, 5, NoteDuration.Eighth, TimeSignatureDrawType.Regular), []);

  expect(log).toBe("r--------------------------------------¬");
});

it("renders a full bar rest as such - 7/8", () => {
  const q = 8;
  const len = q * 7;
  const log = parse(len, create_time_signature(0, 7, NoteDuration.Eighth, TimeSignatureDrawType.Regular), []);

  expect(log).toBe("r------------------------------------------------------¬");
});

it("renders a full bar note as such - 2/4", () => {
  const c = 16;
  const len = c * 2;
  const log = parse(len, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, len, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o------------------------------¬");
});

it("renders a full bar note as such - 6/8", () => {
  const q = 8;
  const len = q * 6;
  const log = parse(len, create_time_signature(0, 6, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, len, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o----------------------------------------------¬");
});

it("pattern in 6/8", () => {
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
    "o----------------------¬o------¬o------¬o------¬o--------------¬o------¬o----------------------¬"
  );
});

it("pattern in 3/4", () => {
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
    "o----------------------¬o------¬o------¬o------¬o--------------¬o------¬o_______o--------------¬"
  );
});

it("renders a full bar note as such - 3/4", () => {
  const c = 16;
  const len = c * 3;
  const log = parse(len, create_time_signature(0, 6, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, len, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o----------------------------------------------¬");
});

it("renders a full bar note as such - 9/8", () => {
  const q = 8;
  const len = q * 9;
  const log = parse(len, create_time_signature(0, 9, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, len, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o_______________________________________________o----------------------¬");
});

it("renders a full bar note as such - 4/4", () => {
  const c = 16;
  const len = c * 4;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, len, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o--------------------------------------------------------------¬");
});

it("renders a full bar note as such - 12/8", () => {
  const q = 8;
  const len = q * 12;
  const log = parse(len, create_time_signature(0, 12, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, len, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o----------------------------------------------------------------------------------------------¬");
});

it("renders a full bar note as such - 5/8", () => {
  const q = 8;
  const len = q * 5;
  const log = parse(len, create_time_signature(0, 5, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, len, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o_______________________o--------------¬");
});

it("renders a full bar note as such - 7/8", () => {
  const q = 8;
  const len = q * 7;
  const log = parse(len, create_time_signature(0, 7, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, len, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o_______________________o------------------------------¬");
});

it("renders correctly - 4/4 [c---]", () => {
  const c = 16;
  const len = c * 4;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, c, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o--------------¬r--------------¬r------------------------------¬");
});

it("renders correctly - 4/4 [c--c]", () => {
  const c = 16;
  const len = c * 4;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, c, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(c * 3, c, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o--------------¬r--------------¬r--------------¬o--------------¬");
});

it("renders correctly - 4/4 [---c]", () => {
  const c = 16;
  const len = c * 4;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(c * 3, c, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("r------------------------------¬r--------------¬o--------------¬");
});

it("renders correctly - 6/8 [q-----]", () => {
  const q = 8;
  const len = q * 6;
  const log = parse(len, create_time_signature(0, 6, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o------¬r------¬r------¬r----------------------¬");
});

it("renders correctly - 6/8 [c--c]", () => {
  const q = 8;
  const len = q * 6;
  const log = parse(len, create_time_signature(0, 6, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, q * 2, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 4, q * 2, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o--------------¬r------¬r------¬o--------------¬");
});

it("renders correctly - 6/8 [-----q]", () => {
  const q = 8;
  const len = q * 6;
  const log = parse(len, create_time_signature(0, 6, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(q * 5, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("r----------------------¬r------¬r------¬o------¬");
});

it("renders correctly - 12/8 [q-----------]", () => {
  const q = 8;
  const len = q * 12;
  const log = parse(len, create_time_signature(0, 12, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o------¬r------¬r------¬r----------------------¬r----------------------------------------------¬");
});

it("renders correctly - 12/8 [q----------q]", () => {
  const q = 8;
  const len = q * 12;
  const log = parse(len, create_time_signature(0, 12, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 11, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o------¬r------¬r------¬r----------------------¬r----------------------¬r------¬r------¬o------¬");
});

it("renders correctly - 12/8 [-----------q]", () => {
  const q = 8;
  const len = q * 12;
  const log = parse(len, create_time_signature(0, 12, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(q * 11, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("r----------------------------------------------¬r----------------------¬r------¬r------¬o------¬");
});

it("renders correctly - 3/4 [c--]", () => {
  const c = 16;
  const len = c * 3;
  const log = parse(len, create_time_signature(0, 3, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, c, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o--------------¬r--------------¬r--------------¬");
});

it("renders correctly - 3/4 [--c]", () => {
  const c = 16;
  const len = c * 3;
  const log = parse(len, create_time_signature(0, 3, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(c * 2, c, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("r--------------¬r--------------¬o--------------¬");
});

it("renders correctly - 9/8 [c.------]", () => {
  const q = 8;
  const len = q * 9;
  const log = parse(len, create_time_signature(0, 9, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, q * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o----------------------¬r----------------------¬r----------------------¬");
});

it("renders correctly - 9/8 [------c.]", () => {
  const q = 8;
  const len = q * 9;
  const log = parse(len, create_time_signature(0, 9, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(q * 6, q * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("r----------------------¬r----------------------¬o----------------------¬");
});

it("renders correctly - 2/4 [----s]", () => {
  const sq = 4;
  const len = sq * 8;
  const log = parse(len, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(sq * 7, sq, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("r--------------¬r----------¬o--¬");
});

it("renders correctly - 6/8 [c_ss---]", () => {
  const sq = 4;
  const len = sq * 12;
  const log = parse(len, create_time_signature(0, 6, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, sq * 5, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(sq * 5, sq, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o_______________o--¬o--¬r----------------------¬");
});

it("renders correctly - 2/4 [qcq]", () => {
  const q = 8;
  const len = q * 4;
  const log = parse(len, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q, q * 2, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 3, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o------¬o--------------¬o------¬");
});

it("renders correctly - 2/4 [sq._c]", () => {
  const sq = 4;
  const len = sq * 8;
  const log = parse(len, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, sq, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(sq, sq * 7, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o--¬o___________o--------------¬");
});

it("renders correctly - 3/4 [m_qq]", () => {
  const q = 8;
  const len = q * 6;
  const log = parse(len, create_time_signature(0, 3, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, q * 5, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 5, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o_______________________________o------¬o------¬");
});

it("renders correctly - 3/4 [qq_c.q]", () => {
  const q = 8;
  const len = q * 6;
  const log = parse(len, create_time_signature(0, 3, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q, q * 4, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 5, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o------¬o_______o----------------------¬o------¬");
});

it("renders correctly - 3/4 [c.q_c]", () => {
  const q = 8;
  const len = q * 6;
  const log = parse(len, create_time_signature(0, 3, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, q * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 3, q * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o----------------------¬o_______o--------------¬");
});

it("renders correctly - 3/4 [qq_m]", () => {
  const q = 8;
  const len = q * 6;
  const log = parse(len, create_time_signature(0, 3, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q, q * 5, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o------¬o_______o------------------------------¬");
});

it("renders correctly - 6/8 [qc_c.]", () => {
  const q = 8;
  const len = q * 6;
  const log = parse(len, create_time_signature(0, 6, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q, q * 5, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o------¬o_______________o----------------------¬");
});

it("renders correctly - 6/8 [q.s_q_c.]", () => {
  const sq = 4;
  const len = sq * 12;
  const log = parse(len, create_time_signature(0, 6, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, sq * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(sq * 3, sq * 9, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o----------¬o___o_______o----------------------¬");
});

it("renders correctly - 9/8 [m._cq]", () => {
  const q = 8;
  const len = q * 9;
  const log = parse(len, create_time_signature(0, 9, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, q * 8, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 8, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o_______________________________________________o--------------¬o------¬");
});

it("renders correctly - 2/4 [qc.]", () => {
  const q = 8;
  const len = q * 4;
  const log = parse(len, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q, q * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o------¬o----------------------¬");
});

it("renders correctly - 2/4 [q.q]", () => {
  const q = 8;
  const len = q * 4;
  const log = parse(len, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, q * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 3, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o----------------------¬o------¬");
});

it("renders correctly - 4/4 [cm.]", () => {
  const c = 16;
  const len = c * 4;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, c, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(c, c * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o--------------¬o----------------------------------------------¬");
});

it("renders correctly - 4/4 [m.c]", () => {
  const c = 16;
  const len = c * 4;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, c * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(c * 3, c, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o----------------------------------------------¬o--------------¬");
});

it("renders correctly - 4/4 [sq._c_m]", () => {
  const sq = 4;
  const len = sq * 16;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, sq, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(sq, sq * 15, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o--¬o___________o_______________o------------------------------¬");
});

it("renders correctly - 4/4 [qc._qcq]", () => {
  const q = 8;
  const len = q * 8;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q, q * 4, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 5, q * 2, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 7, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o------¬o_______________________o------¬o--------------¬o------¬");
});

it("renders correctly - 4/4 [qqqq_c.q]", () => {
  const q = 8;
  const len = q * 8;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 2, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 3, q * 4, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(q * 7, q, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o------¬o------¬o------¬o_______o----------------------¬o------¬");
});

it("renders correctly - 4/4 [m_c_q-]", () => {
  const q = 8;
  const len = q * 8;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, q * 7, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o_______________________________o_______________o------¬r------¬");
});

it("renders correctly - 4/4 [m.-]", () => {
  const q = 8;
  const len = q * 8;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, q * 6, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o----------------------------------------------¬r--------------¬");
});

it("renders correctly - 4/4 [m_c.s-]", () => {
  const sq = 4;
  const len = sq * 16;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, sq * 14, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(sq * 14, sq, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o_______________________________o----------------------¬o--¬r--¬");
});

it("renders correctly - 4/4 [m_c.-s]", () => {
  const sq = 4;
  const len = sq * 16;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, sq * 14, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(sq * 15, sq, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o_______________________________o_______________o------¬r--¬o--¬");
});

it("renders correctly - 4/4 [-m.]", () => {
  const q = 8;
  const len = q * 8;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(q * 2, q * 6, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("r--------------¬o----------------------------------------------¬");
});

it("renders correctly - 4/4 [q.sc_c-]", () => {
  const sq = 4;
  const len = sq * 16;
  const log = parse(len, create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, sq * 3, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(sq * 3, sq, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(sq * 4, sq * 8, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o----------¬o--¬o_______________o--------------¬r--------------¬");
});

it("renders correctly - 2/4 [sq._q.s]", () => {
  const sq = 4;
  const len = sq * 16;
  const log = parse(len, create_time_signature(0, 2, NoteDuration.Quarter, TimeSignatureDrawType.Regular), [
    create_tone(0, sq, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
    create_tone(sq, sq * 6, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o--¬o___________o----------¬r--¬r------------------------------¬");
});

it("renders correctly - 3/8 [q._|q-]", () => {
  const q = 8;
  const len = q * 6;
  const log = parse(len, create_time_signature(0, 3, NoteDuration.Eighth, TimeSignatureDrawType.Regular), [
    create_tone(0, q * 5, { int: 60, accidental: Accidental.Natural }, 100, Articulation.None),
  ]);

  expect(log).toBe("o_______________________o--------------¬r------¬");
});
