import { BracketingType } from "../store/entries/brackets";

export enum BracketSpan {
    None,
    Start,
    Continue,
}

export function isSpan(
    instrumentFamily: string,
    previousInstrumentFamily: string | undefined,
    bracketing: BracketingType
): BracketSpan {
    // no bracketing between instruments
    if (bracketing === BracketingType.None) {
        return BracketSpan.None;
    }

    // bracket all instruments together apart from keyboard instruments
    if (bracketing === BracketingType.SmallEnsemble) {
        if (instrumentFamily === "keyboards") {
            return BracketSpan.None;
        }
        if (!previousInstrumentFamily || previousInstrumentFamily === "keyboards") {
            return BracketSpan.Start;
        }
        return BracketSpan.Continue;
    }

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
