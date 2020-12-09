import { Accidental } from "./defs";
import { getStepsBetweenPitches } from "./utils";

describe("getStepsBetweenPitches", () => {
  it("generates correct steps", () => {
    const steps = getStepsBetweenPitches(
      { int: 60, accidental: Accidental.Natural },
      { int: 62, accidental: Accidental.Natural }
    );
    expect(steps).toEqual(1);
  });
  it("generates correct steps", () => {
    const steps = getStepsBetweenPitches(
      { int: 60, accidental: Accidental.Natural },
      { int: 61, accidental: Accidental.Flat }
    );
    expect(steps).toEqual(1);
  });
  it("generates correct steps", () => {
    const steps = getStepsBetweenPitches(
      { int: 60, accidental: Accidental.Natural },
      { int: 63, accidental: Accidental.Sharp }
    );
    expect(steps).toEqual(1);
  });
  it("generates correct steps", () => {
    const steps = getStepsBetweenPitches(
      { int: 60, accidental: Accidental.Natural },
      { int: 59, accidental: Accidental.Natural }
    );
    expect(steps).toEqual(-1);
  });
  it("generates correct steps", () => {
    const steps = getStepsBetweenPitches(
      { int: 60, accidental: Accidental.Natural },
      { int: 60, accidental: Accidental.Sharp }
    );
    expect(steps).toEqual(-1);
  });
  it("generates correct steps", () => {
    const steps = getStepsBetweenPitches(
      { int: 60, accidental: Accidental.Natural },
      { int: 60, accidental: Accidental.DoubleFlat }
    );
    expect(steps).toEqual(1);
  });
  it("generates correct steps", () => {
    const steps = getStepsBetweenPitches(
      { int: 60, accidental: Accidental.Natural },
      { int: 72, accidental: Accidental.DoubleFlat }
    );
    expect(steps).toEqual(8);
  });
  it("generates correct steps", () => {
    const steps = getStepsBetweenPitches(
      { int: 60, accidental: Accidental.Natural },
      { int: 58, accidental: Accidental.Flat }
    );
    expect(steps).toEqual(-1);
  });
});
