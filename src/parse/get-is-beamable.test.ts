import { NoteDuration } from "../store/entries/defs";
import { getIsBeamable } from "./get-is-beamable";

describe("getIsbeamable", () => {
  it("is correct (Whole)", () => {
    const result = getIsBeamable(16 * 4, 16);
    expect(result).toBe(false);
  });
  it("is correct (Dotted Whole)", () => {
    const result = getIsBeamable(16 * 6, 16);
    expect(result).toBe(false);
  });
  it("is correct (Half)", () => {
    const result = getIsBeamable(16 * 2, 16);
    expect(result).toBe(false);
  });
  it("is correct (Dotted Half)", () => {
    const result = getIsBeamable(16 * 3, 16);
    expect(result).toBe(false);
  });
  it("is correct (Quarter)", () => {
    const result = getIsBeamable(16, 16);
    expect(result).toBe(false);
  });
  it("is correct (Dotted Quarter)", () => {
    const result = getIsBeamable(24, 16);
    expect(result).toBe(false);
  });
  it("is correct (Eighth)", () => {
    const result = getIsBeamable(8, 16);
    expect(result).toBe(true);
  });
  it("is correct (Dotted Eighth)", () => {
    const result = getIsBeamable(12, 16);
    expect(result).toBe(true);
  });
  it("is correct (Sixteenth)", () => {
    const result = getIsBeamable(4, 16);
    expect(result).toBe(true);
  });
  it("is correct (Dotted Sixteenth)", () => {
    const result = getIsBeamable(6, 16);
    expect(result).toBe(true);
  });
});
