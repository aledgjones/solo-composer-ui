import { BracketingType } from "../store/entries/brackets";
import { Instrument } from "../store/score-instrument/defs";
import { getInstrumentFamily } from "./get-instrument-family";

export enum BracketSpan {
  None,
  Start,
  Continue,
}

export function isSpan(
  instrument: Instrument,
  previousInstrument: Instrument | undefined,
  bracketing: BracketingType
): BracketSpan {
  // no bracketing between instruments
  if (bracketing === BracketingType.None) {
    return BracketSpan.None;
  }

  // bracket all instruments together apart from keyboard instruments
  if (bracketing === BracketingType.SmallEnsemble) {
    if (instrument.staves.length > 1) {
      return BracketSpan.None;
    }
    if (!previousInstrument || previousInstrument.staves.length > 1) {
      return BracketSpan.Start;
    }
    return BracketSpan.Continue;
  }

  const instrumentFamily = getInstrumentFamily(instrument);
  const previousInstrumentFamily = getInstrumentFamily(previousInstrument);

  // bracket together in instrument family groups
  if (bracketing === BracketingType.Orchestral) {
    switch (instrumentFamily) {
      case "strings":
      case "woodwinds":
      case "brass":
        if (instrumentFamily === previousInstrumentFamily) {
          return BracketSpan.Continue;
        } else {
          return BracketSpan.Start;
        }
      default:
        return BracketSpan.None;
    }
  }

  return BracketSpan.None;
}
