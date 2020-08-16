import { unpack } from "jsonpack";
import { Transport, Progress, Player } from "solo-composer-scheduler";
import { store, empty } from "./use-store";
import {
    ThemeMode,
    View,
    Tool,
    Score,
    Flow,
    AutoCountStyle,
    PlayerType,
    NoteDuration,
    TimeSignatureDrawType,
    EntryType,
    Articulation,
    Pitch,
    Tone,
    TimeSignature,
} from "./defs";
import { get_def } from "./instrument-defs";
import { playbackActions } from "./playback";
import { download, chooseFiles } from "../ui";
import { create_empty_stave } from "./stave";
import { create_player } from "./player";
import { move, duration_to_ticks } from "./utils";
import { create_instrument } from "./instrument";
import { create_absolute_tempo } from "./absolute-tempo";
import { insert_entry, remove_entry, move_entry } from "./track";
import {
    create_time_signature,
    get_entry_after_tick,
    get_entries_at_tick,
} from "./time_signature";
import { create_tone } from "./tone";
import { create_flow } from "./flow";

// I know these are just wrapping funcs but it allows more acurate typings than wasm-pack produces
// and it's really easy to swap between js and wasm funcs if needed.
export const actions = {
    app: {
        audition: {
            toggle: () => {
                store.update((s) => {
                    localStorage.setItem(
                        "sc:audition/v1",
                        JSON.stringify(!s.app.audition)
                    );
                    s.app.audition = !s.app.audition;
                });
            },
        },
        theme: (value: ThemeMode) => {
            store.update((s) => {
                localStorage.setItem("sc:theme-mode/v1", JSON.stringify(value));
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
            const state = store.getRawState();
            const filename = state.score.meta.title
                ? state.score.meta.title
                      .toLocaleLowerCase()
                      .replace(/\s/g, "-") + ".scf"
                : "untitled.scf";
            download(state.score, filename);
        },
        /**
         * Import a score
         */
        import: async (progress: Progress) => {
            const resp = await chooseFiles();
            const file = resp.files[0];
            if (file) {
                // cleanup old state
                actions.playback.transport.stop();
                actions.playback.transport.to_start();
                actions.playback.instrument.destroyAll();
                progress(4, 1);

                // import the json file
                const content = await file.text();
                const score: Score = unpack(content);
                progress(4, 2);

                // set the imported state in the engine
                store.update(() => {
                    const e = empty();
                    return {
                        ...e,
                        score,
                        ui: {
                            ...e.ui,
                            flow_key: score.flows.order[0],
                        },
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
                store.update((s) => {
                    s.score.meta.title = value;
                }),
            subtitle: (value: string) =>
                store.update((s) => {
                    s.score.meta.subtitle = value;
                }),
            composer: (value: string) =>
                store.update((s) => {
                    s.score.meta.composer = value;
                }),
            arranger: (value: string) =>
                store.update((s) => {
                    s.score.meta.arranger = value;
                }),
            lyricist: (value: string) =>
                store.update((s) => {
                    s.score.meta.lyricist = value;
                }),
            copyright: (value: string) =>
                store.update((s) => {
                    s.score.meta.copyright = value;
                }),
        },
        config: {
            auto_count: {
                solo: (value: AutoCountStyle) =>
                    store.update((s) => {
                        s.score.config.auto_count.solo = value;
                    }),
                section: (value: AutoCountStyle) =>
                    store.update((s) => {
                        s.score.config.auto_count.section = value;
                    }),
            },
        },
        flow: {
            create: (): string => {
                const flow: Flow = create_flow();
                store.update((s) => {
                    s.score.flows.order.push(flow.key);
                    s.score.flows.by_key[flow.key] = flow;
                });
                return flow.key;
            },
            rename: (flow_key: string, title: string) =>
                store.update((s) => {
                    s.score.flows.by_key[flow_key].title = title;
                }),
            length: (flow_key: string, length: number) =>
                store.update((s) => {
                    s.score.flows.by_key[flow_key].length = length;
                }),
            reorder: (old_index: number, new_index: number) =>
                store.update((draft) => {
                    move(draft.score.flows.order, old_index, new_index);
                }),
            assign_player: (flow_key: string, player_key: string) =>
                store.update((draft, state) => {
                    const flow = draft.score.flows.by_key[flow_key];
                    flow.players.push(player_key);

                    const player = state.score.players.by_key[player_key];
                    player.instruments.forEach((instrumentKey) => {
                        const instrument =
                            state.score.instruments[instrumentKey];
                        const instrumentDef = get_def(instrument.id);
                        instrument.staves.forEach((staveKey, i) => {
                            const staveDef = instrumentDef.staves[i];
                            const stave = create_empty_stave(
                                staveKey,
                                staveDef
                            );
                            flow.staves[staveKey] = stave;
                        });
                    });
                }),
            unassign_player: (flow_key: string, player_key: string) =>
                store.update((draft, state) => {
                    // remove each instrument from the flow
                    const player = state.score.players.by_key[player_key];
                    player.instruments.forEach((instrumentKey) => {
                        state.score.instruments[instrumentKey].staves.forEach(
                            (stave_key) => {
                                delete draft.score.flows.by_key[flow_key]
                                    .staves[stave_key];
                            }
                        );
                    });

                    draft.score.flows.by_key[
                        flow_key
                    ].players = state.score.flows.by_key[
                        flow_key
                    ].players.filter((k) => k !== player_key);
                }),
            remove: (flow_key: string) =>
                store.update((draft, state) => {
                    draft.score.flows.order = state.score.flows.order.filter(
                        (k) => k !== flow_key
                    );
                    delete draft.score.flows.by_key[flow_key];
                }),
        },
        player: {
            create: (player_type: PlayerType): string => {
                const player = create_player(player_type);
                store.update((draft, state) => {
                    draft.score.players.order.push(player.key);
                    draft.score.players.by_key[player.key] = player;

                    state.score.flows.order.forEach((flowKey) => {
                        draft.score.flows.by_key[flowKey].players.push(
                            player.key
                        );
                    });
                });
                return player.key;
            },
            assign_instrument: (player_key: string, instrument_key: string) =>
                store.update((draft, state) => {
                    draft.score.players.by_key[player_key].instruments.push(
                        instrument_key
                    );
                    const instrument = state.score.instruments[instrument_key];

                    state.score.flows.order.forEach((flowKey) => {
                        const flow = draft.score.flows.by_key[flowKey];
                        if (flow.players.includes(player_key)) {
                            const instrumentDef = get_def(instrument.id);
                            instrument.staves.forEach((staveKey, i) => {
                                const staveDef = instrumentDef.staves[i];
                                const stave = create_empty_stave(
                                    staveKey,
                                    staveDef
                                );
                                flow.staves[staveKey] = stave;
                            });
                        }
                    });
                }),
            reorder: (old_index: number, new_index: number) =>
                store.update((draft) => {
                    move(draft.score.players.order, old_index, new_index);
                }),
            remove: (player_key: string) => {
                store.update((draft, state) => {
                    // for each instrument...
                    state.score.players.by_key[player_key].instruments.forEach(
                        (instrument_key) => {
                            // destroy instrument staves in each flow
                            state.score.flows.order.forEach((flow_key) => {
                                const flow = state.score.flows.by_key[flow_key];
                                if (flow.players.includes(player_key)) {
                                    state.score.instruments[
                                        instrument_key
                                    ].staves.forEach((stave_key) => {
                                        delete draft.score.flows.by_key[
                                            flow_key
                                        ].staves[stave_key];
                                    });
                                }
                            });

                            // delete the actual instrument
                            delete draft.score.instruments[instrument_key];

                            // destroy the playback
                            delete draft.playback.instruments[instrument_key];
                            Player.disconnect(instrument_key);
                        }
                    );

                    // remove the player from each flow
                    state.score.flows.order.forEach((flow_key) => {
                        draft.score.flows.by_key[
                            flow_key
                        ].players = state.score.flows.by_key[
                            flow_key
                        ].players.filter((k) => k !== player_key);
                    });

                    // remove the player itself
                    delete draft.score.players.by_key[player_key];
                    draft.score.players.order = state.score.players.order.filter(
                        (k) => k !== player_key
                    );
                });
            },
        },
        instrument: {
            create: (id: string): string => {
                const instrument = create_instrument(id);
                store.update((draft) => {
                    draft.score.instruments[instrument.key] = instrument;
                });
                return instrument.key;
            },
            reorder: (
                player_key: string,
                old_index: number,
                new_index: number
            ) =>
                store.update((draft) => {
                    move(
                        draft.score.players.by_key[player_key].instruments,
                        old_index,
                        new_index
                    );
                }),
            remove: (player_key: string, instrument_key: string) =>
                store.update((draft, state) => {
                    // destroy instrument staves in each flow
                    state.score.flows.order.forEach((flow_key) => {
                        const flow = state.score.flows.by_key[flow_key];
                        if (flow.players.includes(player_key)) {
                            state.score.instruments[
                                instrument_key
                            ].staves.forEach((stave_key) => {
                                delete draft.score.flows.by_key[flow_key]
                                    .staves[stave_key];
                            });
                        }
                    });

                    // delete the instrument from the player
                    draft.score.players.by_key[
                        player_key
                    ].instruments = state.score.players.by_key[
                        player_key
                    ].instruments.filter((k) => k !== instrument_key);

                    // delete the actual instrument
                    delete draft.score.instruments[instrument_key];

                    // destroy the playback
                    delete draft.playback.instruments[instrument_key];
                    Player.disconnect(instrument_key);
                }),
            /**
             * Set volume of an instrument 0 - 100
             */
            volume(instrument_key: string, volume: number) {
                const value = parseInt(volume.toFixed(0));
                store.update((draft) => {
                    draft.score.instruments[instrument_key].volume = value;
                });
                Player.volume(instrument_key, value / 100);
            },
            mute(instrument_key: string) {
                store.update((draft) => {
                    draft.score.instruments[instrument_key].mute = true;
                });
                Player.mute(instrument_key);
            },
            unmute(instrument_key: string) {
                store.update((draft) => {
                    draft.score.instruments[instrument_key].mute = false;
                });
                Player.unmute(instrument_key);
            },
            solo(instrument_key: string) {
                store.update((draft) => {
                    draft.score.instruments[instrument_key].solo = true;
                });
                Player.solo(instrument_key);
            },
            unsolo(instrument_key: string) {
                store.update((draft) => {
                    draft.score.instruments[instrument_key].solo = false;
                });
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
                    groupings?: number[]
                ): string => {
                    const time_signature = create_time_signature(
                        tick,
                        beats,
                        beat_type,
                        draw_type,
                        groupings
                    );
                    store.update((draft, state) => {
                        // remove any time signature already at the current tick
                        const flow = state.score.flows.by_key[flow_key];
                        const entries = flow.master.entries.by_tick[tick] || [];
                        entries.forEach((entry_key) => {
                            if (
                                flow.master.entries.by_key[entry_key].type ===
                                EntryType.TimeSignature
                            ) {
                                remove_entry(
                                    draft.score.flows.by_key[flow_key].master,
                                    entry_key
                                );
                            }
                        });
                        insert_entry(
                            draft.score.flows.by_key[flow_key].master,
                            time_signature
                        );
                        const ticks_per_bar =
                            duration_to_ticks(
                                time_signature.beat_type,
                                flow.subdivisions
                            ) * time_signature.beats;
                        const next = get_entry_after_tick(
                            tick,
                            flow.master,
                            EntryType.TimeSignature
                        ) as TimeSignature;
                        const overflow = next
                            ? (next.tick - tick) % ticks_per_bar
                            : (flow.length - tick) % ticks_per_bar;

                        if (overflow > 0) {
                            // add aditional ticks to flow length to make full bars
                            draft.score.flows.by_key[flow_key].length =
                                flow.length + (ticks_per_bar - overflow);
                        }

                        // move the future time signatures by the offset
                        for (let i = tick + 1; i < flow.length; i++) {
                            const entries = get_entries_at_tick(
                                i,
                                flow.master,
                                EntryType.TimeSignature
                            );
                            entries.forEach((entry) => {
                                move_entry(
                                    draft.score.flows.by_key[flow_key].master,
                                    entry.key,
                                    i + (ticks_per_bar - overflow)
                                );
                            });
                        }
                    });

                    return time_signature.key;
                },
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
                ): string => {
                    const tempo = create_absolute_tempo(
                        tick,
                        text,
                        beat_type,
                        dotted,
                        bpm,
                        parenthesis_visible,
                        text_visible,
                        bpm_visible
                    );

                    store.update((draft, state) => {
                        // remove any tempo already at the current tick
                        const entries =
                            state.score.flows.by_key[flow_key].master.entries
                                .by_tick[tick] || [];
                        entries.forEach((entry_key) => {
                            if (
                                state.score.flows.by_key[flow_key].master
                                    .entries.by_key[entry_key].type ===
                                EntryType.AbsoluteTempo
                            ) {
                                delete draft.score.flows.by_key[flow_key].master
                                    .entries.by_key[entry_key];
                            }
                        });

                        // insert the new tempo
                        insert_entry(
                            draft.score.flows.by_key[flow_key].master,
                            tempo
                        );
                    });

                    return tempo.key;
                },
            },
            tone: {
                /**
                 * Create a new tone.
                 *
                 * With MIDI pitches, tick counts and velocity 0-127
                 */
                create: (
                    flow_key: string,
                    stave_key: string,
                    track_key: string,
                    tick: number,
                    duration: number,
                    pitch: Pitch,
                    velocity: number,
                    articulation: Articulation
                ): string => {
                    const tone = create_tone(
                        tick,
                        duration,
                        pitch,
                        velocity,
                        articulation
                    );

                    store.update((draft, state) => {
                        insert_entry(
                            draft.score.flows.by_key[flow_key].staves[stave_key]
                                .tracks.by_key[track_key],
                            tone
                        );
                    });

                    return tone.key;
                },
                update: (
                    flow_key: string,
                    stave_key: string,
                    track_key: string,
                    entry_key: string,
                    tick: number,
                    duration: number,
                    pitch: Pitch,
                    articulation: Articulation
                ) => {
                    store.update((draft) => {
                        move_entry(
                            draft.score.flows.by_key[flow_key].staves[stave_key]
                                .tracks.by_key[track_key],
                            entry_key,
                            tick
                        );
                        const tone = draft.score.flows.by_key[flow_key].staves[
                            stave_key
                        ].tracks.by_key[track_key].entries.by_key[
                            entry_key
                        ] as Tone;
                        tone.duration = duration;
                        tone.pitch = pitch;
                        tone.articulation = articulation;
                    });
                },
                slice: (
                    flow_key: string,
                    stave_key: string,
                    track_key: string,
                    entry_key: string,
                    slice_at: number
                ) => {
                    store.update((draft, state) => {
                        const track =
                            draft.score.flows.by_key[flow_key].staves[stave_key]
                                .tracks.by_key[track_key];
                        const old_tone = track.entries.by_key[
                            entry_key
                        ] as Tone;
                        const new_tone = create_tone(
                            slice_at,
                            old_tone.duration - (slice_at - old_tone.tick),
                            old_tone.pitch,
                            old_tone.velocity,
                            old_tone.articulation
                        );
                        insert_entry(track, new_tone);
                        old_tone.duration = slice_at - old_tone.tick;
                    });
                },
                remove: (
                    flow_key: string,
                    stave_key: string,
                    track_key: string,
                    entry_key: string
                ) => {
                    store.update((draft) => {
                        remove_entry(
                            draft.score.flows.by_key[flow_key].staves[stave_key]
                                .tracks.by_key[track_key],
                            entry_key
                        );
                    });
                },
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

// debuggable
const self = window as any;
self._actions = actions;
