import { Transport, Sampler, Gain } from "tone";
import { get_patches } from "solo-composer-engine";
import { store } from "../use-store";
import { samplers } from ".";
import { Status } from "../defs";
import { PatchFromFile } from "./defs";

export const playbackActions = {
    metronome: {
        toggle: () => {
            store.update((s) => {
                s.playback.metronome = !s.playback.metronome;
            });
        }
    },
    transport: {
        ppq: (ppq: number) => {
            Transport.PPQ = ppq;
        },
        play: () => {
            store.update((s) => {
                s.playback.transport.playing = true;
                Transport.start();
            });
        },
        stop: () => {
            store.update((s) => {
                s.playback.transport.playing = false;
                Transport.pause();
            });
        },
        rewind: () => {
            Transport.seconds = 0;
        }
    },
    instrument: {
        load: async (id: string, instrumentKey: string) => {
            // create a gain node with the default volume and connect to output
            const gain = new Gain(0.8);
            gain.toDestination();

            // create an entry for the instrument.
            samplers[instrumentKey] = {
                gain,
                expressions: {}
            };

            // kick things off ready for loading in the sampler
            store.update((s) => {
                s.playback.instruments[instrumentKey] = {
                    key: instrumentKey,
                    id,
                    status: Status.Pending,
                    progress: 0,
                    volume: 80,
                    mute: false,
                    solo: false,
                    expressions: {}
                };
            });

            // get the expression map from instrument id id
            const expression_map: { [expression: number]: string } = get_patches(id);
            let expressions = Object.entries(expression_map);
            let expressions_complete = 0;

            Promise.all(
                expressions.map(async ([expression, url]) => {
                    const expressionKey = parseInt(expression); // expression is actually an enum so convert to int
                    const sampler = new Sampler().connect(gain);
                    store.update((s) => {
                        s.playback.instruments[instrumentKey].expressions[expressionKey] = {
                            key: expressionKey,
                            progress: 0,
                            status: Status.Pending
                        };
                    });
                    const resp = await fetch(url);
                    const data: PatchFromFile = await resp.json();
                    const pitches: [any, string][] = Object.entries(data.samples);

                    sampler.attack = data.envelope.attack;
                    sampler.release = data.envelope.release;

                    let pitches_complete = 0;
                    await Promise.all(
                        pitches.map(async ([pitch, sample]) => {
                            return new Promise((resolve) => {
                                sampler.add(pitch, sample, () => {
                                    pitches_complete++;
                                    store.update((s) => {
                                        s.playback.instruments[instrumentKey].expressions[
                                            expressionKey
                                        ].progress = pitches_complete / pitches.length;
                                    });
                                    resolve();
                                });
                            });
                            ``;
                        })
                    );

                    // attach the sampler to the samplers object;
                    samplers[instrumentKey].expressions[expressionKey] = sampler;

                    // the entire expression is loaded so inc the instrument progress
                    expressions_complete++;
                    store.update((s) => {
                        s.playback.instruments[instrumentKey].expressions[expressionKey].status =
                            Status.Ready;
                        s.playback.instruments[instrumentKey].progress =
                            expressions_complete / expressions.length;
                    });
                })
            );

            // all expressions for this instrument are loaded so set instrument to ready.
            store.update((s) => {
                s.playback.instruments[instrumentKey].status = Status.Ready;
            });
        },
        mute: (instrument_key: string) => {
            store.update((s) => {
                s.playback.instruments[instrument_key].mute = !s.playback.instruments[
                    instrument_key
                ].mute;
            });
        },
        solo: (instrument_key: string) => {
            store.update((s) => {
                s.playback.instruments[instrument_key].solo = !s.playback.instruments[
                    instrument_key
                ].solo;
            });
        },
        volume: (instrument_key: string, volume: number) => {
            store.update((s) => {
                const value = parseInt(volume.toFixed(0));
                s.playback.instruments[instrument_key].volume = value;
                samplers[instrument_key].gain.gain.value = value / 100;
            });
        }
    }
};
