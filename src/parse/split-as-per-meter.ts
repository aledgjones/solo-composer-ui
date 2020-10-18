import { NotationTrack, getNearestNotationToTick } from "./notation-track";
import { Flow } from "../store/score-flow/defs";
import { getIsRest } from "./get-is-rest";
import { splitNotationTrack } from "./split-notation-track";
import {
    duration_to_ticks,
    get_entries_at_tick,
} from "../store/entries/time-signature/utils";
import { EntryType, NoteDuration } from "../store/entries";
import { TimeSignature } from "../store/entries/time-signature/defs";
import { getIsEmpty } from "./get-is-empty";
import { getIsWritable } from "./get-is-writable";
import { getBeatGroupingBoundries } from "./get-beat-group-boundries";

function getNextGroupingAndBeat(grouping: number, beatType: NoteDuration) {
    switch (grouping) {
        case 2:
            return { groupings: [1, 1], beats: 2, beatType };
        case 3:
            return { groupings: [1, 1, 1], beats: 3, beatType };
        case 4:
            return { groupings: [1, 1, 1, 1], beats: 4, beatType };

        case 1:
        default:
            return {
                groupings: [1, 1, 1, 1],
                beats: 4,
                beatType: beatType + 1,
            };
    }
}

export function splitUnit(
    start: number,
    stop: number,
    subdivisions: number,
    beats: number,
    beatType: NoteDuration,
    ticksPerOriginalBeat: number,
    groupings: number[],
    track: NotationTrack,
    isFullBar: boolean
): NotationTrack {
    const ticksPerBeat = duration_to_ticks(beatType, subdivisions);
    const groupingBoundries = getBeatGroupingBoundries(
        start,
        ticksPerBeat,
        groupings
    );

    // if the unit is empty we stop the reccursion as there is no need for higher fidelity
    const unitIsEmpty = getIsEmpty(start, stop, track);

    if (unitIsEmpty) {
        const lastGroupingBoundry =
            groupingBoundries[groupingBoundries.length - 2];
        if (
            isFullBar &&
            !getIsRest(track[start]) &&
            !getIsWritable(track[start].duration, subdivisions)
        ) {
            track = splitNotationTrack(track, lastGroupingBoundry);
        }
    } else {
        if (groupings.length === 2 || groupings.length === 4) {
            if (beats % 3 === 0) {
                // 6/8 etc....

                const middle = groupingBoundries[groupings.length / 2];
                const found = getNearestNotationToTick(middle, track);
                if (found) {
                    track = splitNotationTrack(track, middle);
                }
            } else {
                const quarter =
                    (groupingBoundries[groupings.length / 2] - start) / 2;

                const firstBeat = start;
                const secondBeat = start + quarter;
                const thirdBeat = groupingBoundries[groupings.length / 2];
                const fourthBeat = start + quarter * 3;

                if (
                    getIsEmpty(firstBeat, secondBeat, track) &&
                    track[secondBeat] &&
                    !getIsRest(track[secondBeat]) &&
                    track[fourthBeat] &&
                    getIsEmpty(secondBeat, fourthBeat, track)
                ) {
                    // 2/4 [qcq] dont't split middle
                } else if (
                    track[secondBeat] &&
                    !getIsRest(track[secondBeat]) &&
                    getIsEmpty(secondBeat, stop, track)
                ) {
                    // 2/4 [qc.] dont't split middle
                } else if (
                    track[firstBeat] &&
                    getIsEmpty(firstBeat, fourthBeat, track) &&
                    track[fourthBeat] &&
                    // dotted crotchets bassically have their own rules.
                    (track[firstBeat].duration !== ticksPerOriginalBeat * 1.5 ||
                        !getIsRest(track[fourthBeat]))
                ) {
                    // 2/4 [c.q] don't split middle unless q === rest
                } else {
                    track = splitNotationTrack(track, thirdBeat);
                }
            }
        }

        if (groupings.length === 3) {
            const firstBeat = groupingBoundries[0];
            const secondBeat = groupingBoundries[1];
            const thirdBeat = groupingBoundries[2];

            // split all rests at beats
            for (let i = 0; i < groupingBoundries.length; i++) {
                const boundry = groupingBoundries[i];
                const found = getNearestNotationToTick(boundry, track);
                if (found && getIsRest(found.entry)) {
                    track = splitNotationTrack(track, boundry);
                }
            }

            // make sure it doesn't look compound! (c. at end of bar)
            const middle = start + ticksPerBeat * 1.5;
            if (track[middle] && getIsEmpty(middle, stop, track)) {
                track = splitNotationTrack(track, thirdBeat);
            }

            // sustain two beats into one
            if (!getIsEmpty(firstBeat, secondBeat, track)) {
                track = splitNotationTrack(track, secondBeat);
            }

            // if we haven't made any splits we split at the first boundry
            if (!track[groupingBoundries[1]] && !track[groupingBoundries[2]]) {
                track = splitNotationTrack(track, thirdBeat);
            }
        }

        groupingBoundries.forEach((curr, i) => {
            const next = groupingBoundries[i + 1];
            if (next) {
                const grouping = groupings[i];
                const {
                    groupings: nextGroupings,
                    beats: nextBeats,
                    beatType: nextBeatType,
                } = getNextGroupingAndBeat(grouping, beatType);
                track = splitUnit(
                    curr,
                    next,
                    subdivisions,
                    nextBeats,
                    nextBeatType,
                    ticksPerOriginalBeat,
                    nextGroupings,
                    track,
                    false
                );
            }
        });
    }

    return track;
}

export function splitAsPerMeter(
    flow: Flow,
    track: NotationTrack,
    barlines: Set<number>
) {
    let time: TimeSignature;

    for (let tick = 0; tick < flow.length; tick++) {
        const result = get_entries_at_tick(
            tick,
            flow.master,
            EntryType.TimeSignature
        );
        if (result[0]) {
            time = result[0] as TimeSignature;
        }

        if (barlines.has(tick)) {
            // split the notes at barlines
            track = splitNotationTrack(track, tick);

            // split notes as per time signature groupings
            const start = tick;
            const stop =
                tick +
                duration_to_ticks(time.beat_type, flow.subdivisions) *
                    time.beats;

            splitUnit(
                start,
                stop,
                flow.subdivisions,
                time.beats,
                time.beat_type,
                duration_to_ticks(time.beat_type, flow.subdivisions),
                time.groupings,
                track,
                true
            );
        }
    }

    return track;
}
