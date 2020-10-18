import { Player } from "../store/score-player/defs";
import { Instrument } from "../store/score-instrument/defs";
import { Flow } from "../store/score-flow/defs";
import { NotationTracks } from "./notation-track";
import { BarlineDrawType, Barline } from "../store/entries/barline/defs";
import {
    get_entries_at_tick,
    measureTimeSignatureBounds,
} from "../store/entries/time-signature/utils";
import { EntryType } from "../store/entries";
import { TimeSignature } from "../store/entries/time-signature/defs";
import { KeySignature } from "../store/entries/key-signature/defs";
import { WidthOf } from "./sum-width-up-to";
import { measureKeySignatureBounds } from "../store/entries/key-signature/utils";
import { measureBarlineBounds } from "../store/entries/barline/utils";

export type HorizontalSpacing = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];

export function measureTick(
    tick: number,
    players: { order: string[]; by_key: { [key: string]: Player } },
    instruments: { [key: string]: Instrument },
    flow: Flow,
    isFirstBeat: boolean,
    notationTracks: NotationTracks
) {
    const measurements: HorizontalSpacing = [
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.2, // TODO: remove static spacing
        0.0,
    ];

    const time = get_entries_at_tick(
        tick,
        flow.master,
        EntryType.TimeSignature
    )[0] as TimeSignature;
    const key = get_entries_at_tick(
        tick,
        flow.master,
        EntryType.KeySignature
    )[0] as KeySignature;
    const barline = get_entries_at_tick(
        tick,
        flow.master,
        EntryType.Barline
    )[0] as Barline;

    if (time) {
        measurements[WidthOf.TimeSignature] = measureTimeSignatureBounds(
            time
        ).width;
    }

    if (key) {
        measurements[WidthOf.KeySignature] = measureKeySignatureBounds(
            key
        ).width;
    }

    if (barline) {
        // TODO: seperate start/end barlines if clef, key or timesig.
        const width = measureBarlineBounds(barline.draw_type).width;
        if (barline.draw_type === BarlineDrawType.StartRepeat) {
            measurements[WidthOf.StartRepeat] = width;
        } else if (barline.draw_type === BarlineDrawType.EndRepeat) {
            measurements[WidthOf.EndRepeat] = width;
        } else {
            measurements[WidthOf.Barline] = width;
        }
    } else if (tick !== 0) {
        if (key || time) {
            measurements[WidthOf.Barline] = measureBarlineBounds(
                BarlineDrawType.Double
            ).width;
        } else if (isFirstBeat) {
            measurements[WidthOf.Barline] = measureBarlineBounds(
                BarlineDrawType.Normal
            ).width;
        }
    }

    return measurements;
}
