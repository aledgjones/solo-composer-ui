import { create_absolute_tempo, normalize_bpm } from "./utils";
import { NoteDuration, DottedValue } from "../defs";

it("calculates q = 120 as 120", () => {
  const ts = create_absolute_tempo(0, "Allegro", NoteDuration.Quarter, DottedValue.None, 120, false, false, false);
  const bpm = normalize_bpm(ts);
  expect(bpm).toEqual(120);
});

it("calculates h = 120 as 240", () => {
  const ts = create_absolute_tempo(0, "Allegro", NoteDuration.Half, DottedValue.None, 120, false, false, false);
  const bpm = normalize_bpm(ts);
  expect(bpm).toEqual(240);
});

it("calculates h = 120 as 240", () => {
  const ts = create_absolute_tempo(0, "Allegro", NoteDuration.Half, DottedValue.None, 120, false, false, false);
  const bpm = normalize_bpm(ts);
  expect(bpm).toEqual(240);
});

it("calculates e = 120 as 60", () => {
  const ts = create_absolute_tempo(0, "Allegro", NoteDuration.Eighth, DottedValue.None, 120, false, false, false);
  const bpm = normalize_bpm(ts);
  expect(bpm).toEqual(60);
});

it("calculates h. = 100 as 300", () => {
  const ts = create_absolute_tempo(0, "Allegro", NoteDuration.Half, DottedValue.Single, 100, false, false, false);
  const bpm = normalize_bpm(ts);
  expect(bpm).toEqual(300);
});

it("calculates q. = 60 as 90", () => {
  const ts = create_absolute_tempo(0, "Allegro", NoteDuration.Quarter, DottedValue.Single, 60, false, false, false);
  const bpm = normalize_bpm(ts);
  expect(bpm).toEqual(90);
});
