import { Accidental } from "./defs";
import { pitchToParts } from "./utils";

describe("pitchToParts", () => {
  it("generates correct pitch parts", () => {
    const parts = pitchToParts({ int: 60, accidental: Accidental.Natural });
    expect(parts).toEqual(["C", Accidental.Natural, 4]);
  });

  it("generates correct pitch parts", () => {
    const parts = pitchToParts({ int: 69, accidental: Accidental.Natural });
    expect(parts).toEqual(["A", Accidental.Natural, 4]);
  });

  it("generates correct pitch parts", () => {
    const parts = pitchToParts({ int: 71, accidental: Accidental.Flat });
    expect(parts).toEqual(["C", Accidental.Flat, 5]);
  });

  it("generates correct pitch parts", () => {
    const parts = pitchToParts({ int: 60, accidental: Accidental.Sharp });
    expect(parts).toEqual(["B", Accidental.Sharp, 3]);
  });
});
