import { useMemo, useEffect } from "react";
import { mdiAccount, mdiAccountGroup } from "@mdi/js";
import { useStore } from "./use-store";
import { Player, Instrument, View } from "./defs";
import {
    PlayerType,
    AutoCountStyle,
    TimeSignatureDrawType,
    NoteDuration,
    def_tree,
    get_full_path_from_partial,
} from "solo-composer-engine";
import { toRoman } from "roman-numerals";
import { actions } from "./actions";

export * from "./playback/utils";

function count_to_string(style: AutoCountStyle, count?: number) {
    if (count === null) {
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

export function getFullPathFromPartial(
    path: string[]
): { path: string[]; id: string } {
    return get_full_path_from_partial(path);
}

export function useDefsList(path: string[]): string[][] {
    return useMemo(() => {
        return def_tree(path);
    }, [path]);
}

export function duration_to_ticks(
    subdivisions: number,
    duration: NoteDuration
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

export function useAutoSetup() {
    // make actions available globally for debugging
    useEffect(() => {
        const win = window as any;
        win.sc_actions = actions;
    }, []);

    // the actual auto setup bit
    useEffect(() => {
        const ppq = 16;

        actions.score.meta.title("String Quartet in B${flat}");
        actions.score.meta.subtitle("Op. 18, No. 6");
        actions.score.meta.composer("Beethoven");

        const flow_key = actions.score.flow.create();
        actions.score.flow.rename(flow_key, "Allegro con brio");
        actions.score.entries.time_signature.create(
            flow_key,
            0,
            3,
            NoteDuration.Quarter,
            TimeSignatureDrawType.Normal
        );
        actions.score.flow.length(flow_key, ppq * 3 * 16);
        actions.score.entries.absolute_tempo.create(
            flow_key,
            0,
            "Adagio",
            NoteDuration.Quarter,
            0,
            60,
            true,
            true,
            true
        );

        const players = [
            { type: PlayerType.Solo, instruments: ["strings.violin"] },
            { type: PlayerType.Solo, instruments: ["strings.violin"] },
            { type: PlayerType.Solo, instruments: ["strings.viola"] },
            { type: PlayerType.Solo, instruments: ["strings.violoncello"] },
        ];

        players.forEach((player) => {
            const playerKey = actions.score.player.create(player.type);
            player.instruments.forEach((instrument) => {
                const instrumentKey = actions.score.instrument.create(
                    instrument
                );
                actions.score.player.assign_instrument(
                    playerKey,
                    instrumentKey
                );
                actions.playback.instrument.load(instrument, instrumentKey);
            });
        });

        actions.ui.view(View.Play);
    }, []);
}
