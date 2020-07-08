import {
    ThemeMode,
    AutoCountStyle,
    View,
    PlayerType,
    Tool,
    TimeSignatureDrawType,
    NoteDuration
} from "solo-composer-engine";
import { engine } from "./use-store";
import { Patches } from "./defs";

interface CreateInstrumentReturn {
    patches: Patches;
    key: string;
}

// I know these are just wrapping funcs but it allows more acurate typings
export const actions = {
    app: {
        audition: (value: boolean) => engine.set_audition(value),
        theme: (value: ThemeMode) => engine.set_theme(value)
    },
    playback: {
        metronome: (value: boolean) => engine.set_metronome(value)
    },
    sampler: {
        // <=== TO DO
    },
    score: {
        meta: {
            title: (value: string) => engine.set_title(value),
            subtitle: (value: string) => engine.set_subtitle(value),
            composer: (value: string) => engine.set_composer(value),
            arranger: (value: string) => engine.set_arranger(value),
            lyricist: (value: string) => engine.set_lyricist(value),
            copyright: (value: string) => engine.set_copyright(value)
        },
        config: {
            auto_count: {
                solo: (value: AutoCountStyle) => engine.set_auto_count_style_solo(value),
                section: (value: AutoCountStyle) => engine.set_auto_count_style_section(value)
            }
        },
        flow: {
            create: () => engine.create_flow(),
            rename: (flow_key: string, title: string) => engine.rename_flow(flow_key, title),
            length: (flow_key: string, length: number) => engine.set_flow_length(flow_key, length),
            reorder: (old_index: number, new_index: number) => engine.reorder_flow(old_index, new_index),
            assign_player: (flow_key: string, player_key: string) => engine.assign_player(flow_key, player_key),
            unassign_player: (flow_key: string, player_key: string) => engine.unassign_player(flow_key, player_key),
            remove: (flow_key: string) => engine.remove_flow(flow_key)
        },
        player: {
            create: (player_type: PlayerType): string => engine.create_player(player_type),
            assign_instrument: (player_key: string, instrument_key: string): string =>
                engine.assign_instrument(player_key, instrument_key),
            reorder: (old_index: number, new_index: number) => engine.reorder_player(old_index, new_index),
            remove: (player_key: string) => engine.remove_player(player_key)
        },
        instrument: {
            create: (id: string): CreateInstrumentReturn => engine.create_instrument(id),
            reorder: (player_key: string, old_index: number, new_index: number) =>
                engine.reorder_instrument(player_key, old_index, new_index),
            remove: (player_key: string, instrument_key: string) =>
                engine.remove_instrument(player_key, instrument_key),
            mute: (instrument_key: string) => engine.toggle_mute_instrument(instrument_key),
            solo: (instrument_key: string) => engine.toggle_solo_instrument(instrument_key),
            volume: (instrument_key: string, volume: number) => engine.set_volume_instrument(instrument_key, volume)
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
                ) => engine.create_time_signature(flow_key, tick, beats, beat_type, draw_type, groupings)
            },
            tone: {
                create: (flow_key: string, track_key: string, tick: number, duration: number, pitch: number): string =>
                    engine.create_tone(flow_key, track_key, tick, duration, pitch),

                update: (
                    flow_key: string,
                    track_key: string,
                    entry_key: string,
                    tick: number,
                    duration: number,
                    pitch: number
                ) => engine.update_tone(flow_key, track_key, entry_key, tick, duration, pitch),

                remove: (flow_key: string, track_key: string, entry_key: string) =>
                    engine.remove_tone(flow_key, track_key, entry_key)
            }
        }
    },
    ui: {
        view: (value: View) => engine.set_view(value),
        snap: (snap: NoteDuration) => engine.set_snap(snap),
        flow_key: (key: string) => engine.set_flow_key(key),
        setup: {
            expand: (key: string) => engine.setup_expand(key),
            collapse: (key: string) => engine.setup_collapse(key)
        },
        play: {
            expand: (key: string) => engine.play_expand(key),
            collapse: (key: string) => engine.play_collapse(key),
            // TODO: make height a none fixeed number
            keyboard: (instrument_key: string, base: number) => engine.set_play_keyboard(instrument_key, base, 17),
            tool: (tool: Tool) => engine.set_play_tool(tool),
            zoom: (zoom: number) => engine.set_play_zoom(zoom)
        }
    }
};
