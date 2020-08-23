import shortid from "shortid";
import { toRoman } from "roman-numerals";
import { Instrument } from "./defs";
import { instrumentDefs } from "./instrument-defs";
import { PlayerType, Player } from "../score-player/defs";
import { useMemo } from "react";
import { AutoCountStyle } from "../score-config/defs";
import { useStore } from "../use-store";

export function create_instrument(id: string): Instrument {
    const { type: instrument_type, long_name, short_name, staves } = get_def(
        id
    );
    return {
        key: shortid(),
        id,
        type: instrument_type,
        long_name,
        short_name,
        staves: staves.map(() => shortid()),
        volume: 80,
        mute: false,
        solo: false,
    };
}

export function get_def(id: string) {
    return instrumentDefs.find((def) => def.id === id);
}

export function get_patches(id: string, player_type: PlayerType) {
    const def = get_def(id);
    return def.patches[player_type];
}

export function get_full_path_from_partial(
    selection: string[]
): { path: string[]; id: string } {
    const def = instrumentDefs.find((def) => {
        for (let i = 0; i < selection.length; i++) {
            if (selection[i] !== def.path[i]) {
                // we have a mis-match
                return false;
            }
        }
        // we have run out of selection so the first def is the one we want even if partial
        return true;
    });

    return {
        path: def.path,
        id: def.id,
    };
}

export function useDefsList(path: string[]): string[][] {
    return useMemo(() => {
        const seen: Set<string> = new Set();
        const tree: string[][] = [[], [], []];
        instrumentDefs.forEach((def) => {
            for (let i = 0; i < def.path.length; i++) {
                if (!seen.has(def.path[i])) {
                    tree[i].push(def.path[i]);
                    seen.add(def.path[i]);
                }
                if (def.path[i] !== path[i]) {
                    break;
                }
            }
        });
        return tree;
    }, [path]);
}

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

export function instrumentName(
    instrument: Instrument,
    count_style: AutoCountStyle,
    count?: number
) {
    return instrument.long_name + count_to_string(count_style, count);
}

interface InstrumentCountsTotals {
    [name: string]: {
        [PlayerType.Solo]: string[];
        [PlayerType.Section]: string[];
    };
}

export type InstrumentCounts = { [instrumentKey: string]: number };

export function getCounts(
    players: { order: string[]; by_key: { [key: string]: Player } },
    instruments: { [key: string]: Instrument }
) {
    const counts = players.order.reduce<InstrumentCountsTotals>(
        (output, playerKey) => {
            const player = players.by_key[playerKey];
            player.instruments.forEach((instrumentKey) => {
                const instrument = instruments[instrumentKey];
                if (!output[instrument.long_name]) {
                    output[instrument.long_name] = {
                        [PlayerType.Solo]: [],
                        [PlayerType.Section]: [],
                    };
                }
                output[instrument.long_name][player.type].push(instrument.key);
            });
            return output;
        },
        {}
    );

    const names = Object.keys(counts);
    return names.reduce<InstrumentCounts>((out, name) => {
        counts[name][PlayerType.Solo].forEach((instrumentKey, i, _names) => {
            if (_names.length > 1) {
                out[instrumentKey] = i + 1;
            }
        });

        counts[name][PlayerType.Solo].forEach((instrumentKey, i, _names) => {
            if (_names.length > 1) {
                out[instrumentKey] = i + 1;
            }
        });
        return out;
    }, {});
}

/**
 * Counts duplicate instrument names
 *
 * If there is more than one of the same instrument we add an auto inc count.
 * we use the length of the count array to tell if > 1 if so index + 1 = instrument number.
 *
 * eg violin ${counts['violin'].length + 1} = Violin *1*
 */
export function useCounts() {
    const [players, instruments] = useStore((s) => [
        s.score.players,
        s.score.instruments,
    ]);

    return useMemo(() => {
        return getCounts(players, instruments);
    }, [players, instruments]);
}

export function getNames(
    players: { order: string[]; by_key: { [key: string]: Player } },
    instruments: { [key: string]: Instrument },
    count_styles: { [type in PlayerType]: AutoCountStyle }
) {
    const counts = getCounts(players, instruments);
    return players.order.reduce<string[]>((out, player_key) => {
        const player = players.by_key[player_key];
        player.instruments.forEach((instrument_key) => {
            const instrument = instruments[instrument_key];
            out.push(
                instrumentName(
                    instrument,
                    count_styles[player.type],
                    counts[instrument_key]
                )
            );
        });
        return out;
    }, []);
}
