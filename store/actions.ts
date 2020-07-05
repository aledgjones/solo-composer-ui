import {
    ThemeMode,
    AutoCountStyle,
    View,
    PlayerType,
    Tool,
    TimeSignatureDrawType,
    NoteDuration
} from "solo-composer-engine";
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
            subtitle: (value: string) => store.set_subtitle(value),
            composer: (value: string) => store.set_composer(value),
            arranger: (value: string) => store.set_arranger(value),
            lyricist: (value: string) => store.set_lyricist(value),
            copyright: (value: string) => store.set_copyright(value)
        },
        config: {
            auto_count: {
                solo: (value: AutoCountStyle) => store.set_auto_count_style_solo(value),
                section: (value: AutoCountStyle) => store.set_auto_count_style_section(value)
            }
        },
        flow: {
            create: () => store.create_flow(),
            rename: (flow_key: string, title: string) => store.rename_flow(flow_key, title),
            length: (flow_key: string, length: number) => store.set_flow_length(flow_key, length),
            reorder: (old_index: number, new_index: number) => store.reorder_flow(old_index, new_index),
            assign_player: (flow_key: string, player_key: string) => store.assign_player(flow_key, player_key),
            unassign_player: (flow_key: string, player_key: string) => store.unassign_player(flow_key, player_key),
            remove: (flow_key: string) => store.remove_flow(flow_key)
        },
        player: {
            create: (player_type: PlayerType): string => store.create_player(player_type),
            assign_instrument: (player_key: string, instrument_key: string): string =>
                store.assign_instrument(player_key, instrument_key),
            reorder: (old_index: number, new_index: number) => store.reorder_player(old_index, new_index),
            remove: (player_key: string) => store.remove_player(player_key)
        },
        instrument: {
            create: (id: string): CreateInstrumentReturn => store.create_instrument(id),
            reorder: (player_key: string, old_index: number, new_index: number) =>
                store.reorder_instrument(player_key, old_index, new_index),
            remove: (player_key: string, instrument_key: string) => store.remove_instrument(player_key, instrument_key),
            mute: (instrument_key: string) => store.toggle_mute_instrument(instrument_key),
            solo: (instrument_key: string) => store.toggle_solo_instrument(instrument_key),
            volume: (instrument_key: string, volume: number) => store.set_volume_instrument(instrument_key, volume)
        },
        entries: {
            time_signature: {
                create: (
                    flow_key: string,
                    tick: number,
                    beats: number,
                    beat_type: number,
                    draw_type: TimeSignatureDrawType,
                    groupings?: Uint8Array
                ) => store.create_time_signature(flow_key, tick, beats, beat_type, draw_type, groupings)
            },
            tone: {
                create: (flow_key: string, track_key: string, tick: number, duration: number, pitch: number): string =>
                    store.create_tone(flow_key, track_key, tick, duration, pitch),

                update: (
                    flow_key: string,
                    track_key: string,
                    entry_key: string,
                    tick: number,
                    duration: number,
                    pitch: number
                ) => store.update_tone(flow_key, track_key, entry_key, tick, duration, pitch),

                remove: (flow_key: string, track_key: string, entry_key: string) =>
                    store.remove_tone(flow_key, track_key, entry_key)
            }
        }
    },
    ui: {
        view: (value: View) => store.set_view(value),
        snap: (snap: NoteDuration) => store.set_snap(snap),
        setup: {
            expand: (key: string) => store.setup_expand(key),
            collapse: (key: string) => store.setup_collapse(key)
        },
        play: {
            expand: (key: string) => store.play_expand(key),
            collapse: (key: string) => store.play_collapse(key),
            // TODO: make height a none fixeed number
            keyboard: (instrument_key: string, base: number) => store.set_play_keyboard(instrument_key, base, 17),
            tool: (tool: Tool) => store.set_play_tool(tool),
            zoom: (zoom: number) => store.set_play_zoom(zoom)
        }
    }
};
