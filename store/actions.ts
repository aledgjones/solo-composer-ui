import localforage from "localforage";
import {
    AutoCountStyle,
    PlayerType,
    TimeSignatureDrawType,
    NoteDuration,
} from "solo-composer-engine";
import { engine, store } from "./use-store";
import { ThemeMode, View, Tool, AbsoluteTempo, TimeSignature } from "./defs";
import { playbackActions } from "./playback";
import { Transport, Progress } from "solo-composer-scheduler";
import { download, chooseFiles } from "../ui";

enum EntryType {
    AbsoluteTempo,
    TimeSignature,
}

interface ImportStruct {
    meta: {
        title: string;
        subtitle: string;
        composer: string;
        arranger: string;
        lyricist: string;
        copyright: string;
    };
    config: {
        auto_count: {
            solo: AutoCountStyle;
            section: AutoCountStyle;
        };
    };
    players: { key: string; player_type: PlayerType; instruments: string[] }[];
    instruments: { key: string; id: string }[];
    flows: {
        key: string;
        title: string;
        players: string[];
        length: number;
        master: Array<
            | { type: EntryType.AbsoluteTempo; entry: AbsoluteTempo }
            | { type: EntryType.TimeSignature; entry: TimeSignature }
        >;
    }[];
}

// I know these are just wrapping funcs but it allows more acurate typings than wasm-pack produces
// and it's really easy to swap between js and wasm funcs if needed.
export const actions = {
    app: {
        audition: {
            toggle: () => {
                store.update((s) => {
                    localforage.setItem("sc:audition/v1", !s.app.audition);
                    s.app.audition = !s.app.audition;
                });
            },
        },
        theme: (value: ThemeMode) => {
            store.update((s) => {
                localforage.setItem("sc:theme-mode/v1", value);
                s.app.theme = value;
            });
        },
    },
    playback: playbackActions,
    score: {
        /**
         * Export the current score
         * // TODO: this is a temporary version of the export which spits out
         * a very basic representation of the score.
         */
        export: () => {
            const score = store.getRawState().score;
            const data: ImportStruct = {
                meta: {
                    title: score.meta.title,
                    subtitle: score.meta.subtitle,
                    composer: score.meta.composer,
                    arranger: score.meta.arranger,
                    lyricist: score.meta.lyricist,
                    copyright: score.meta.copyright,
                },
                config: score.config,
                players: score.players.order.map((player_key) => {
                    const player = score.players.by_key[player_key];
                    return {
                        key: player.key,
                        player_type: player.player_type,
                        instruments: player.instruments,
                    };
                }),
                instruments: Object.values(score.instruments).map(
                    (instrument) => {
                        return {
                            key: instrument.key,
                            id: instrument.id,
                        };
                    }
                ),
                flows: score.flows.order.map((flow_key) => {
                    const flow = score.flows.by_key[flow_key];
                    return {
                        key: flow.key,
                        title: flow.title,
                        players: flow.players,
                        length: flow.length,
                        master: Object.values(flow.master.entries.by_key).map(
                            (entry) => {
                                if (entry.AbsoluteTempo) {
                                    return {
                                        type: EntryType.AbsoluteTempo,
                                        entry: entry.AbsoluteTempo as AbsoluteTempo,
                                    };
                                } else {
                                    return {
                                        type: EntryType.TimeSignature,
                                        entry: entry.TiemSignature as TimeSignature,
                                    };
                                }
                            }
                        ),
                    };
                }),
            };
            download(
                data,
                score.meta.title.toLocaleLowerCase().replace(/\s/g, "-") ||
                    "untitled",
                "application/json"
            );
        },
        /**
         * Import a score
         * // TODO: this is a temporary version of the import
         */
        import: async (progress: Progress) => {
            const resp = await chooseFiles(["application/json"]);
            const file = resp.files[0];
            if (file) {
                // map old id's to new;
                const map = new Map<string, string>();

                // cleanup old state
                engine.reset();
                actions.playback.instrument.destroyAll();
                actions.playback.transport.to_start();
                progress(4, 1);
                // import the json file
                const content = await file.text();
                const score: ImportStruct = JSON.parse(content);
                progress(4, 2);
                // load in the score data
                // meta
                actions.score.meta.title(score.meta.title);
                actions.score.meta.subtitle(score.meta.subtitle);
                actions.score.meta.arranger(score.meta.arranger);
                actions.score.meta.lyricist(score.meta.lyricist);
                actions.score.meta.copyright(score.meta.copyright);
                // config
                actions.score.config.auto_count.solo(
                    score.config.auto_count.solo
                );
                actions.score.config.auto_count.section(
                    score.config.auto_count.section
                );
                // TODO: engrave
                // flows setup before instruments added.
                score.flows.forEach((flow_def) => {
                    const flow_key = actions.score.flow.create();
                    map.set(flow_def.key, flow_key);
                    actions.score.flow.rename(flow_key, flow_def.title);
                    actions.score.flow.length(flow_key, flow_def.length);
                    flow_def.master.forEach((def) => {
                        switch (def.type) {
                            case EntryType.AbsoluteTempo: {
                                const entry = def.entry as AbsoluteTempo;
                                actions.score.entries.absolute_tempo.create(
                                    flow_key,
                                    entry.tick,
                                    entry.text,
                                    entry.beat_type,
                                    entry.dotted,
                                    entry.bpm,
                                    entry.parenthesis_visible,
                                    entry.text_visible,
                                    entry.bpm_visible
                                );
                                break;
                            }
                            case EntryType.TimeSignature: {
                                const entry = def.entry as TimeSignature;
                                actions.score.entries.time_signature.create(
                                    flow_key,
                                    entry.tick,
                                    entry.beats,
                                    entry.beat_type,
                                    entry.draw_type
                                );
                                break;
                            }
                        }
                    });
                });
                progress(4, 3);
                // players
                // await Promise.all(
                //     score.players.order.map(async (player_key) => {
                //         const player_def = score.players.by_key[player_key];
                //         const new_player_key = actions.score.player.create(
                //             player_def.player_type
                //         );
                //         map.set(player_key, new_player_key);

                //         return Promise.all(
                //             player_def.instruments.map(
                //                 async (instrument_key) => {
                //                     const instrument =
                //                         score.instruments[instrument_key];
                //                     const new_instrument_key = actions.score.instrument.create(
                //                         instrument.id
                //                     );
                //                     map.set(instrument_key, new_instrument_key);
                //                     actions.score.player.assign_instrument(
                //                         new_player_key,
                //                         new_instrument_key
                //                     );
                //                     await actions.playback.instrument.load(
                //                         instrument.id,
                //                         new_instrument_key
                //                     );
                //                 }
                //             )
                //         );
                //     })
                // );
                progress(4, 4);
            }
        },
        meta: {
            title: (value: string) => engine.set_title(value),
            subtitle: (value: string) => engine.set_subtitle(value),
            composer: (value: string) => engine.set_composer(value),
            arranger: (value: string) => engine.set_arranger(value),
            lyricist: (value: string) => engine.set_lyricist(value),
            copyright: (value: string) => engine.set_copyright(value),
        },
        config: {
            auto_count: {
                solo: (value: AutoCountStyle) =>
                    engine.set_auto_count_style_solo(value),
                section: (value: AutoCountStyle) =>
                    engine.set_auto_count_style_section(value),
            },
        },
        flow: {
            create: () => engine.create_flow(),
            rename: (flow_key: string, title: string) =>
                engine.rename_flow(flow_key, title),
            length: (flow_key: string, length: number) =>
                engine.set_flow_length(flow_key, length),
            reorder: (old_index: number, new_index: number) =>
                engine.reorder_flow(old_index, new_index),
            assign_player: (flow_key: string, player_key: string) =>
                engine.assign_player(flow_key, player_key),
            unassign_player: (flow_key: string, player_key: string) =>
                engine.unassign_player(flow_key, player_key),
            remove: (flow_key: string) => engine.remove_flow(flow_key),
        },
        player: {
            create: (player_type: PlayerType): string =>
                engine.create_player(player_type),
            assign_instrument: (
                player_key: string,
                instrument_key: string
            ): string => engine.assign_instrument(player_key, instrument_key),
            reorder: (old_index: number, new_index: number) =>
                engine.reorder_player(old_index, new_index),
            remove: (player_key: string) => {
                const s = store.getRawState();
                s.score.players.by_key[player_key].instruments.forEach(
                    (key) => {
                        actions.playback.instrument.destroy(key);
                    }
                );
                engine.remove_player(player_key);
            },
        },
        instrument: {
            create: (id: string): string => engine.create_instrument(id),
            reorder: (
                player_key: string,
                old_index: number,
                new_index: number
            ) => engine.reorder_instrument(player_key, old_index, new_index),
            remove: (player_key: string, instrument_key: string) => {
                actions.playback.instrument.destroy(instrument_key);
                engine.remove_instrument(player_key, instrument_key);
            },
        },
        entries: {
            time_signature: {
                create: (
                    flow_key: string,
                    tick: number,
                    beats: number,
                    beat_type: NoteDuration,
                    draw_type: TimeSignatureDrawType,
                    groupings?: Uint8Array
                ) =>
                    engine.create_time_signature(
                        flow_key,
                        tick,
                        beats,
                        beat_type,
                        draw_type,
                        groupings
                    ),
            },
            absolute_tempo: {
                create: (
                    flow_key: string,
                    tick: number,
                    text: string,
                    beat_type: NoteDuration,
                    dotted: number,
                    bpm: number,
                    parenthesis_visible: boolean,
                    text_visible: boolean,
                    bpm_visible: boolean
                ) =>
                    engine.create_absolute_tempo(
                        flow_key,
                        tick,
                        text,
                        beat_type,
                        dotted,
                        bpm,
                        parenthesis_visible,
                        text_visible,
                        bpm_visible
                    ),
            },
            tone: {
                /**
                 * Create a new tone.
                 *
                 * With MIDI pitches, tick counts and velocity 0-127
                 */
                create: (
                    flow_key: string,
                    track_key: string,
                    tick: number,
                    duration: number,
                    pitch: number,
                    velocity: number
                ): string =>
                    engine.create_tone(
                        flow_key,
                        track_key,
                        tick,
                        duration,
                        pitch,
                        velocity
                    ),
                update: (
                    flow_key: string,
                    track_key: string,
                    entry_key: string,
                    tick: number,
                    duration: number,
                    pitch: number
                ) =>
                    engine.update_tone(
                        flow_key,
                        track_key,
                        entry_key,
                        tick,
                        duration,
                        pitch
                    ),
                slice: (
                    flow_key: string,
                    track_key: string,
                    entry_key: string,
                    slice_at: number
                ) =>
                    engine.slice_tone(flow_key, track_key, entry_key, slice_at),
                remove: (
                    flow_key: string,
                    track_key: string,
                    entry_key: string
                ) => engine.remove_tone(flow_key, track_key, entry_key),
            },
        },
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
                Transport.seek(0);
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
            },
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
                },
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
                    s.ui.play.zoom = parseFloat(zoom.toFixed(2));
                });
            },
        },
    },
};
