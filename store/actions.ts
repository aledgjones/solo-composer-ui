import {
    AutoCountStyle,
    PlayerType,
    TimeSignatureDrawType,
    NoteDuration,
    get_patches,
    pitch_to_frequency,
    Expression
} from "solo-composer-engine";
import { engine, store } from "./use-store";
import { PatchPlayer } from "../patch-player";
import { ThemeMode, View, Tool } from "./defs";
import localforage from "localforage";

// I know these are just wrapping funcs but it allows more acurate typings than wasm-pack produces
export const actions = {
    app: {
        audition: {
            toggle: () => {
                store.update((s) => {
                    localforage.setItem("sc:audition/v1", !s.app.audition);
                    s.app.audition = !s.app.audition;
                });
            }
        },
        theme: (value: ThemeMode) => {
            store.update((s) => {
                localforage.setItem("sc:theme-mode/v1", value);
                s.app.theme = value;
            });
        }
    },
    playback: {
        metronome: {
            toggle: () => {
                store.update((s) => {
                    s.playback.metronome = !s.playback.metronome;
                });
            }
        },
        sampler: {
            load: (id: string, instrumentKey: string) => {
                const patches: { [expression: number]: string } = get_patches(id);
                store.update((s) => {
                    s.playback.sampler[instrumentKey] = {};
                    Object.entries(patches).forEach(([expression, url]) => {
                        s.playback.sampler[instrumentKey][parseInt(expression)] = new PatchPlayer(id, url);
                    });
                });
            },
            play: (
                instrumentKey: string,
                pitch: number,
                velocity: number,
                duration: number,
                expression?: Expression
            ) => {
                const frequency = pitch_to_frequency(pitch);
                // its possible we don't actually have an expression patch to play so play default
                const instrument = store.getRawState().playback.sampler[instrumentKey];
                if (expression === undefined || instrument[expression] === undefined) {
                    instrument[Expression.Natural].play(frequency, velocity, duration);
                } else {
                    instrument[expression].play(frequency, velocity, duration);
                }
            }
        }
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
            create: (id: string): string => engine.create_instrument(id),
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
                slice: (flow_key: string, track_key: string, entry_key: string, slice_at: number) =>
                    engine.slice_tone(flow_key, track_key, entry_key, slice_at),
                remove: (flow_key: string, track_key: string, entry_key: string) =>
                    engine.remove_tone(flow_key, track_key, entry_key)
            }
        }
    },
    ui: {
        view: (view: View) => {
            store.update((s) => {
                s.ui.view = view;
            });
        },
        snap: (snap: NoteDuration) => {
            store.update((s) => {
                s.ui.snap = snap;
            });
        },
        flow_key: (key: string) => {
            store.update((s) => {
                s.ui.flow_key = key;
            });
        },
        setup: {
            expand: (key: string) => {
                store.update((s) => {
                    s.ui.setup.expanded[key] = true;
                });
            },
            collapse: (key: string) => {
                store.update((s) => {
                    delete s.ui.setup.expanded[key];
                });
            }
        },
        play: {
            selection: {
                select: (key: string) => {
                    store.update((s) => {
                        s.ui.play.selected[key] = true;
                    });
                },
                deselect: (key: string) => {
                    store.update((s) => {
                        delete s.ui.play.selected[key];
                    });
                },
                clear: () => {
                    store.update((s) => {
                        s.ui.play.selected = {};
                    });
                }
            },
            expand: (key: string) => {
                store.update((s) => {
                    s.ui.play.expanded[key] = true;
                });
            },
            collapse: (key: string) => {
                store.update((s) => {
                    delete s.ui.play.expanded[key];
                });
            },
            // TODO: make height a none fixeed number
            keyboard: (instrument_key: string, base: number) => {
                store.update((s) => {
                    s.ui.play.keyboard[instrument_key] = { base, height: 17 };
                });
            },
            tool: (tool: Tool) => {
                store.update((s) => {
                    s.ui.play.tool = tool;
                });
            },
            zoom: (zoom: number) => {
                store.update((s) => {
                    s.ui.play.zoom = zoom;
                });
            }
        }
    }
};
