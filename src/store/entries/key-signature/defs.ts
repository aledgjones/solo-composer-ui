import { Entry, Accidental, EntryType } from "..";
import { ClefDrawType } from "../clef";

export enum KeySignatureMode {
    Major = 1,
    Minor,
}

export interface KeySignature extends Entry {
    type: EntryType.KeySignature;
    mode: KeySignatureMode;
    offset: number;
}

interface Patterns {
    [clefType: string]: {
        [clefOffset: number]: {
            [Accidental: number]: number[];
        };
    };
}

export const key_signature_patterns: Patterns = {
    [ClefDrawType.C]: {
        2: {
            [Accidental.Flat]: [3, 0, 4, 1, 5, 2, 6],
            [Accidental.Natural]: [],
            [Accidental.Sharp]: [6, 2, 5, 1, 4, 0, 3],
        },
        4: {
            [Accidental.Flat]: [5, 2, 6, 3, 7, 4, 8],
            [Accidental.Natural]: [],
            [Accidental.Sharp]: [1, 4, 0, 3, 6, 2, 5],
        },
    },
    [ClefDrawType.F]: {
        2: {
            [Accidental.Flat]: [6, 3, 7, 4, 8, 5, 9],
            [Accidental.Natural]: [],
            [Accidental.Sharp]: [2, 5, 1, 4, 7, 3, 6],
        },
    },
    [ClefDrawType.G]: {
        6: {
            [Accidental.Flat]: [4, 1, 5, 2, 6, 3, 7],
            [Accidental.Natural]: [],
            [Accidental.Sharp]: [0, 3, -1, 2, 5, 1, 4],
        },
    },
};
