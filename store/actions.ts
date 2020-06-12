import { ThemeMode, InstrumentAutoCountStyle, View, PlayerType } from "solo-composer-engine";
import { store } from "./use-store";
import { Patches } from "./defs";

interface CreateInstrumentReturn {
    patches: Patches;
    key: string;
}

// I know these are just wrapping funcs but it allows more acurate typings
export const actions = {
    app: {
        audition: (value: boolean) => store.set_audition(value),
        theme: (value: ThemeMode) => store.set_theme(value)
    },
    playback: {
        metronome: (value: boolean) => store.set_metronome(value)
    },
    sampler: {
        // <=== TO DO
    },
    score: {
        meta: {
            title: (value: string) => store.set_title(value),
            composer: (value: string) => store.set_composer(value)
        },
        config: {
            auto_count_style: {
                solo: (value: InstrumentAutoCountStyle) => store.set_auto_count_style_solo(value),
                section: (value: InstrumentAutoCountStyle) =>
                    store.set_auto_count_style_section(value)
            }
        },
        flow: {
            create: () => store.create_flow(),
            rename: (flow_key: string, title: string) => store.rename_flow(flow_key, title),
            reorder: (old_index: number, new_index: number) =>
                store.reorder_flow(old_index, new_index),
            assign_player: (flow_key: string, player_key: string) =>
                store.assign_player(flow_key, player_key),
            unassign_player: (flow_key: string, player_key: string) =>
                store.unassign_player(flow_key, player_key),
            remove: (flow_key: string) => store.remove_flow(flow_key)
        },
        player: {
            create: (player_type: PlayerType): string => store.create_player(player_type),
            assign_instrument: (player_key: string, instrument_key: string): string =>
                store.assign_instrument(player_key, instrument_key),
            reorder: (old_index: number, new_index: number) =>
                store.reorder_player(old_index, new_index),
            remove: (player_key: string) => store.remove_player(player_key)
        },
        instrument: {
            create: (id: string): CreateInstrumentReturn => store.create_instrument(id),
            reorder: (player_key: string, old_index: number, new_index: number) =>
                store.reorder_instrument(player_key, old_index, new_index),
            remove: (player_key: string, instrument_key: string) =>
                store.remove_instrument(player_key, instrument_key)
        }
    },
    ui: {
        view: (value: View) => store.set_view(value),
        expand: (key: string) => store.expand(key),
        collapse: (key: string) => store.collapse(key)
    }
};
