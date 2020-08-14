import localforage from "localforage";
import {
    AutoCountStyle,
    PlayerType,
    TimeSignatureDrawType,
    NoteDuration,
    Articulation,
} from "solo-composer-engine";
import { store, empty, engine } from "./use-store";
import { ThemeMode, View, Tool, Score, Flow } from "./defs";
import { playbackActions } from "./playback";
import { Transport, Progress, Player } from "solo-composer-scheduler";
import { download, chooseFiles } from "../ui";
import shortid from "shortid";
import { Track } from "./track";

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
         */
        export: () => {
            const score = store.getRawState().score;
            download(
                score,
                score.meta.title.toLocaleLowerCase().replace(/\s/g, "-") ||
                    "untitled",
                "application/json"
            );
        },
        /**
         * Import a score
         */
        import: async (progress: Progress) => {
            const resp = await chooseFiles(["application/json"]);
            const file = resp.files[0];
            if (file) {
                // cleanup old state
                actions.ui.view(View.Setup);
                actions.playback.transport.stop();
                actions.playback.transport.to_start();
                actions.playback.instrument.destroyAll();
                progress(4, 1);

                // import the json file
                const content = await file.text();
                const score: Score = JSON.parse(content);
                progress(4, 2);

                // set the imported state in the engine
                store.update((s) => {
                    return {
                        ...empty,
                        score,
                    };
                });

                progress(4, 3);

                //  playback
                await Promise.all(
                    score.players.order.map(async (player_key) => {
                        const player = score.players.by_key[player_key];
                        return Promise.all(
                            player.instruments.map(async (instrument_key) => {
                                const instrument =
                                    score.instruments[instrument_key];
                                await actions.playback.instrument.load(
                                    instrument.id,
                                    instrument.key,
                                    player.player_type
                                );
                                Player.volume(
                                    instrument_key,
                                    instrument.volume / 100
                                );
                                if (instrument.mute) {
                                    Player.mute(instrument_key);
                                }
                                if (instrument.solo) {
                                    Player.solo(instrument_key);
                                }
                            })
                        );
                    })
                );
                progress(4, 4);
            }
        },
        meta: {
            title: (value: string) =>
                store.update((s) => (s.score.meta.title = value)),
            subtitle: (value: string) =>
                store.update((s) => (s.score.meta.title = value)),
            composer: (value: string) =>
                store.update((s) => (s.score.meta.composer = value)),
            arranger: (value: string) =>
                store.update((s) => (s.score.meta.arranger = value)),
            lyricist: (value: string) =>
                store.update((s) => (s.score.meta.lyricist = value)),
            copyright: (value: string) =>
                store.update((s) => (s.score.meta.copyright = value)),
        },
        config: {
            auto_count: {
                solo: (value: AutoCountStyle) =>
                    store.update(
                        (s) => (s.score.config.auto_count.solo = value)
                    ),
                section: (value: AutoCountStyle) =>
                    store.update(
                        (s) => (s.score.config.auto_count.section = value)
                    ),
            },
        },
        flow: {
            create: () => {
                store.update((s) => {
                    const flow: Flow = {
                        key: shortid(),
                        title: "",
                        players: [],
                        length: 16,
                        subdivisions: 16,

                        master: new Track(),
                        staves: {},
                        tracks: {},
                    };
                    s.score.flows.order.push(flow.key);
                    s.score.flows.by_key[flow.key] = flow;
                });
            },
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
            /**
             * Se volume of an instrument 0 - 100
             */
            volume(instrument_key: string, volume: number) {
                const value = parseInt(volume.toFixed(0));
                engine.set_instrument_volume(instrument_key, value);
                Player.volume(instrument_key, value / 100);
            },
            mute(instrument_key: string) {
                engine.set_instrument_mute(instrument_key, true);
                Player.mute(instrument_key);
            },
            unmute(instrument_key: string) {
                engine.set_instrument_mute(instrument_key, false);
                Player.unmute(instrument_key);
            },
            solo(instrument_key: string) {
                engine.set_instrument_solo(instrument_key, true);
                Player.solo(instrument_key);
            },
            unsolo(instrument_key: string) {
                engine.set_instrument_solo(instrument_key, false);
                Player.unsolo(instrument_key);
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
                    velocity: number,
                    articulation: Articulation
                ): string =>
                    engine.create_tone(
                        flow_key,
                        track_key,
                        tick,
                        duration,
                        pitch,
                        velocity,
                        articulation
                    ),
                update: (
                    flow_key: string,
                    track_key: string,
                    entry_key: string,
                    tick: number,
                    duration: number,
                    pitch: number,
                    articulation: Articulation
                ) =>
                    engine.update_tone(
                        flow_key,
                        track_key,
                        entry_key,
                        tick,
                        duration,
                        pitch,
                        articulation
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
