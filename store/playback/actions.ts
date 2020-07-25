import { Sampler, Gain, Meter } from "tone";
import { get_patches } from "solo-composer-engine";
import { store } from "../use-store";
import { samplers } from ".";
import { Status } from "../defs";
import { PatchFromFile, PlaybackInstrument } from "./defs";
import { chain } from "./utils";
import { transport } from "solo-composer-scheduler";

/**
 * Deal with muting and unmuting the MuteNode depending on overall state.
 *
 * Muting is dependant on solo instruments so it must take into account the whole state
 */
function setSamplerMuteStates(instruments: {
    [key: string]: PlaybackInstrument;
}) {
    const order = Object.keys(instruments);

    // solo trumps mute so we need to find if we have solos
    let found_solo = false;
    for (let i = 0; i < order.length; i++) {
        const instrument = instruments[order[i]];
        if (instrument.solo) {
            found_solo = true;
            break;
        }
    }

    // set the correct state
    order.forEach((instrumentKey) => {
        const instrument = instruments[instrumentKey];
        if (instrument.solo) {
            samplers[instrumentKey].muteNode.gain.value = 1;
        } else if (found_solo || instrument.mute) {
            samplers[instrumentKey].muteNode.gain.value = 0;
        } else {
            samplers[instrumentKey].muteNode.gain.value = 1;
        }
    });
}

export const playbackActions = {
    metronome: {
        toggle: () => {
            store.update((s) => {
                s.playback.metronome = !s.playback.metronome;
            });
        },
    },
    transport: {
        play: () => {
            transport.start();
        },
        stop: () => {
            transport.pause();
            Object.values(samplers).forEach((instrument) => {
                Object.values(instrument.expressions).forEach((expression) => {
                    expression.releaseAll(0);
                });
            });
        },
        to_start: () => {
            transport.seek(0);
        },
    },
    instrument: {
        load: async (id: string, instrumentKey: string) => {
            const volumeNode = new Gain(0.8);
            const muteNode = new Gain(1.0);
            const analyserNode = new Meter({
                normalRange: true,
                smoothing: 0.5,
            });

            // link up all the nodes in order
            chain(volumeNode, muteNode, analyserNode);

            // create an entry for the instrument.
            samplers[instrumentKey] = {
                volumeNode,
                muteNode,
                analyserNode,
                expressions: {},
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
                    expressions: {},
                };
            });

            // get the expression map from instrument id id
            const expression_map: {
                [expression: number]: string;
            } = get_patches(id);
            let expressions = Object.entries(expression_map);
            let expressions_complete = 0;

            Promise.all(
                expressions.map(async ([expression, url]) => {
                    const expressionKey = parseInt(expression); // expression is actually an enum so convert to int
                    const sampler = new Sampler().connect(volumeNode);
                    store.update((s) => {
                        s.playback.instruments[instrumentKey].expressions[
                            expressionKey
                        ] = {
                            key: expressionKey,
                            progress: 0,
                            status: Status.Pending,
                        };
                    });
                    const resp = await fetch(url);
                    const data: PatchFromFile = await resp.json();
                    const pitches: [any, string][] = Object.entries(
                        data.samples
                    );

                    sampler.attack = data.envelope.attack;
                    sampler.release = data.envelope.release;

                    let pitches_complete = 0;
                    await Promise.all(
                        pitches.map(async ([pitch, sample]) => {
                            return new Promise((resolve) => {
                                sampler.add(pitch, sample, () => {
                                    pitches_complete++;
                                    store.update((s) => {
                                        s.playback.instruments[
                                            instrumentKey
                                        ].expressions[expressionKey].progress =
                                            pitches_complete / pitches.length;
                                    });
                                    resolve();
                                });
                            });
                            ``;
                        })
                    );

                    // attach the sampler to the samplers object;
                    samplers[instrumentKey].expressions[
                        expressionKey
                    ] = sampler;

                    // the entire expression is loaded so inc the instrument progress
                    expressions_complete++;
                    store.update((s) => {
                        s.playback.instruments[instrumentKey].expressions[
                            expressionKey
                        ].status = Status.Ready;
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
        destroy: (instrument_key: string) => {
            store.update((s) => {
                // dispose of the audio nodes to free up resources
                Object.values(samplers[instrument_key].expressions).forEach(
                    (expression) => {
                        expression.dispose();
                    }
                );
                samplers[instrument_key].volumeNode.dispose();
                samplers[instrument_key].muteNode.dispose();
                samplers[instrument_key].analyserNode.dispose();

                // delete the instrument entries.
                delete samplers[instrument_key];
                delete s.playback.instruments[instrument_key];
            });
        },
        mute: {
            toggle: (instrument_key: string) => {
                store.update((s) => {
                    s.playback.instruments[instrument_key].mute = !s.playback
                        .instruments[instrument_key].mute;
                    setSamplerMuteStates(s.playback.instruments);
                });
            },
        },
        solo: {
            toggle: (instrument_key: string) => {
                store.update((s) => {
                    s.playback.instruments[instrument_key].solo = !s.playback
                        .instruments[instrument_key].solo;
                    setSamplerMuteStates(s.playback.instruments);
                });
            },
        },
        /**
         * hooks up do a simple 0-1 gain node
         */
        volume: (instrument_key: string, volume: number) => {
            store.update((s) => {
                const value = parseInt(volume.toFixed(0));
                s.playback.instruments[instrument_key].volume = value;
                samplers[instrument_key].volumeNode.gain.value = value / 100;
            });
        },
    },
};
