import { useMemo } from "react";
import { mdiAccount, mdiAccountGroup } from "@mdi/js";
import { useStore } from "./use-store";
import {
    Player,
    Instrument,
    AutoCountStyle,
    PlayerType,
    NoteDuration,
    Accidental,
    Pitch,
    TickList,
    Flow,
    TimeSignature,
    EntryType,
    Entry,
} from "./defs";
import { toRoman } from "roman-numerals";
import { kind_from_beats, TimeSignatureType } from "./time_signature";

export * from "./playback/utils";

function count_to_string(style: AutoCountStyle, count?: number) {
    if (count === undefined) {
        return "";
    } else {
        if (style === AutoCountStyle.Roman) {
            return " " + toRoman(count);
        } else {
            return " " + count;
        }
    }
}

export function useCountStyle(playerType: PlayerType) {
    return useStore(
        (s) => {
            if (playerType === PlayerType.Solo) {
                return s.score.config.auto_count.solo;
            } else {
                return s.score.config.auto_count.section;
            }
        },
        [playerType]
    );
}

export function useInstrumentName(
    instrument: Instrument,
    count_style: AutoCountStyle
) {
    return useMemo(() => {
        return (
            instrument.long_name +
            count_to_string(count_style, instrument.count)
        );
    }, [instrument, count_style]);
}

export function usePlayerName(
    player: Player,
    instruments: { [key: string]: Instrument },
    count_style: AutoCountStyle
) {
    return useMemo(() => {
        if (player.instruments.length === 0) {
            switch (player.player_type) {
                case PlayerType.Solo:
                    return "Empty-handed Player";
                default:
                    return "Empty-handed Section";
            }
        } else {
            const len = player.instruments.length;
            return player.instruments.reduce((output, key, i) => {
                const isFirst = i === 0;
                const isLast = i === len - 1;
                const name =
                    instruments[key].long_name +
                    count_to_string(count_style, instruments[key].count);
                if (isFirst) {
                    return name;
                } else if (isLast) {
                    return output + " & " + name;
                } else {
                    return output + ", " + name;
                }
            }, "");
        }
    }, [player, instruments, count_style]);
}

export function usePlayerIcon(player: Player) {
    switch (player.player_type) {
        case PlayerType.Solo:
            return mdiAccount;
        default:
            return mdiAccountGroup;
    }
}

export function duration_to_ticks(
    duration: NoteDuration,
    subdivisions: number
) {
    switch (duration) {
        case NoteDuration.Whole:
            return subdivisions * 4;
        case NoteDuration.Half:
            return subdivisions * 2;
        case NoteDuration.Quarter:
            return subdivisions;
        case NoteDuration.Eighth:
            return subdivisions / 2;
        case NoteDuration.Sixteenth:
            return subdivisions / 4;
        case NoteDuration.ThirtySecond:
            return subdivisions / 8;
        default:
            return subdivisions;
    }
}

export function distance_from_barline(
    tick: number,
    subdivisions: number,
    time_signature: TimeSignature
) {
    if (kind_from_beats(time_signature.beats) === TimeSignatureType.Open) {
        return tick - time_signature.tick;
    } else {
        const ticks_per_bar =
            duration_to_ticks(time_signature.beat_type, subdivisions) *
            time_signature.beats;
        return (tick - time_signature.tick) % ticks_per_bar;
    }
}

export function is_on_beat_type(
    tick: number,
    subdivisions: number,
    time_signature: TimeSignature,
    beat_type: NoteDuration
) {
    if (kind_from_beats(time_signature.beats) === TimeSignatureType.Open) {
        return tick === time_signature.tick;
    } else {
        const ticks_per_beat_type = duration_to_ticks(beat_type, subdivisions);
        return (tick - time_signature.tick) % ticks_per_beat_type === 0;
    }
}

export function is_on_grouping_boundry(
    tick: number,
    subdivisions: number,
    time_signature: TimeSignature
) {
    if (kind_from_beats(time_signature.beats) === TimeSignatureType.Open) {
        return tick === time_signature.tick;
    } else {
        let ticks_per_beat = duration_to_ticks(
            time_signature.beat_type,
            subdivisions
        );
        let bar_length = ticks_per_beat * time_signature.beats;
        let distance_from_first_beat =
            (tick - time_signature.tick) % bar_length;

        if (distance_from_first_beat === 0) {
            return true;
        }

        let offset = 0;
        time_signature.groupings.forEach((group) => {
            offset += group * ticks_per_beat;
            if (distance_from_first_beat == offset) {
                return true;
            }
        });

        return false;
    }
}

export function pitch_from_number(pitch: number): Pitch {
    let step = pitch % 12;
    switch (step) {
        case 0:
        case 2:
        case 4:
        case 5:
        case 7:
        case 9:
        case 10:
            return { int: pitch, accidental: Accidental.Natural };
        default:
            return { int: pitch, accidental: Accidental.Sharp };
    }
}

export function move(arr: any[], from: number, to: number) {
    return arr.splice(to, 0, arr.splice(from, 1)[0]);
}

export function useTimestamp(current: number, flow_key: string) {
    const flow = useStore((s) => s.score.flows.by_key[flow_key], [flow_key]);
    const timestamps = useMemo(() => {
        let bar = 0;
        let time_signature: TimeSignature = null;
        const stamps: string[] = [];

        // look for the previous time signature
        for (let tick = 0; tick <= flow.length; tick++) {
            const entries = flow.master.entries.by_tick[tick] || [];
            const result = entries
                .map(
                    (key): Entry => {
                        return flow.master.entries.by_key[key];
                    }
                )
                .filter((entry) => {
                    return entry.type === EntryType.TimeSignature;
                });

            if (result.length > 0) {
                time_signature = result[0] as TimeSignature;
            }

            let ticks_per_quarter = duration_to_ticks(
                NoteDuration.Quarter,
                flow.subdivisions
            );
            let ticks_per_sixteenth = duration_to_ticks(
                NoteDuration.Sixteenth,
                flow.subdivisions
            );

            let distance = distance_from_barline(
                tick,
                flow.subdivisions,
                time_signature
            );

            if (distance === 0) {
                bar++;
            }

            let beat = Math.floor(distance / ticks_per_quarter) + 1;
            let sixteenth =
                (distance % ticks_per_quarter) / ticks_per_sixteenth;

            stamps.push(`${bar}:${beat}:${sixteenth.toFixed(3)}`);
        }
        return stamps;
    }, [flow]);

    return timestamps[current];
}

export function useTicks(flow_key: string): TickList {
    const flow = useStore((s) => s.score.flows.by_key[flow_key], [flow_key]);

    return useMemo(() => {
        const quarter_width = 72.0;
        const ticks: TickList = {
            list: [],
            width: 0,
        };

        let time_signature: TimeSignature = null;

        for (let tick = 0; tick < flow.length; tick++) {
            const entries = flow.master.entries.by_tick[tick] || [];
            const result = entries
                .map((key): Entry => flow.master.entries.by_key[key])
                .filter((entry) => entry.type === EntryType.TimeSignature);

            if (result.length > 0) {
                time_signature = result[0] as TimeSignature;
            }

            let ticks_per_quarter = duration_to_ticks(
                NoteDuration.Quarter,
                flow.subdivisions
            );
            let distance = distance_from_barline(
                tick,
                flow.subdivisions,
                time_signature
            );

            const tick_width = quarter_width / ticks_per_quarter;

            ticks.list.push({
                tick,
                x: ticks.width,
                width: tick_width,
                is_beat: is_on_beat_type(
                    tick,
                    flow.subdivisions,
                    time_signature,
                    time_signature.beat_type
                ),
                is_first_beat: distance === 0,
                is_quaver_beat: is_on_beat_type(
                    tick,
                    flow.subdivisions,
                    time_signature,
                    NoteDuration.Eighth
                ),
                is_grouping_boundry: is_on_grouping_boundry(
                    tick,
                    flow.subdivisions,
                    time_signature
                ),
            });

            ticks.width = ticks.width + tick_width;
        }

        return ticks;
    }, [flow]);
}
