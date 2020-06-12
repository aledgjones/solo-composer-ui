import { useMemo } from "react";
import { store } from "./use-store";
import { Player, Instrument } from "./defs";
import { PlayerType, InstrumentAutoCountStyle } from "solo-composer-engine";
import { mdiAccount, mdiAccountGroup } from "@mdi/js";
import { toRoman } from "roman-numerals";

function count_to_string(style: InstrumentAutoCountStyle, count?: number) {
    if (count === undefined) {
        return "";
    } else {
        if (style === InstrumentAutoCountStyle.Roman) {
            return " " + toRoman(count);
        } else {
            return " " + count;
        }
    }
}

export const useCounts = (players: Player[], instruments: { [key: string]: Instrument }) => {
    // we need to update the counts when the state changes but counts is calculated on the rust side
    // using its own state so we don't actually need to pass through the state maually.
    return useMemo(() => {
        return store.counts();
    }, [players, instruments]);
};

export function useInstrumentName(
    auto_count_style: InstrumentAutoCountStyle,
    instrument: Instrument,
    count?: number
) {
    return useMemo(() => {
        if (count) {
            return instrument.long_name + count_to_string(auto_count_style, count);
        } else {
            return instrument.long_name;
        }
    }, [instrument, count]);
}

export function usePlayerName(
    player: Player,
    instruments: { [key: string]: Instrument },
    counts: { [key: string]: number },
    auto_count_style: InstrumentAutoCountStyle
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
                const count = counts[key];
                const name = instruments[key].long_name + count_to_string(auto_count_style, count);
                if (isFirst) {
                    return name;
                } else if (isLast) {
                    return output + " & " + name;
                } else {
                    return output + ", " + name;
                }
            }, "");
        }
    }, [player.player_type, player.instruments, instruments, counts]);
}

export function usePlayerIcon(player: Player) {
    switch (player.player_type) {
        case PlayerType.Solo:
            return mdiAccount;
        default:
            return mdiAccountGroup;
    }
}

export function getFullPathFromPartial(path: string[]): { path: string[]; id: string } {
    return store.get_full_path_from_partial(path);
}

export function useDefsList(path: string[]): string[][] {
    return useMemo(() => {
        return store.def_tree(path);
    }, [path]);
}
