import { Transport, Sampler, Gain } from "tone";
import { get_patches } from "solo-composer-engine";
import { store } from "../use-store";
import { samplers } from ".";
import { Status } from "../defs";
import { PatchFromFile, PlaybackInstrument } from "./defs";

/**
 * Deal with muting and unmuting the MuteNode depending on overall state.
 *
 * Muting is dependant on solo instruments so it must take into account the whole state
 */
function setSamplerMuteStates(instruments: { [key: string]: PlaybackInstrument }) {
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
            samplers[instrumentKey].mute.gain.value = 1;
        } else if (found_solo || instrument.mute) {
            samplers[instrumentKey].mute.gain.value = 0;
        } else {
            samplers[instrumentKey].mute.gain.value = 1;
        }
    });
}

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
                Object.keys(s.playback.instruments).forEach((instrument_key) => {
                    const instrument = samplers[instrument_key];
                    Object.values(instrument.expressions).forEach((expression) => {
                        expression.releaseAll(0);
                    });
                });
                Transport.pause();
            });
        },
        to_start: () => {
            Transport.ticks = 0;
        }
    },
    instrument: {
        load: async (id: string, instrumentKey: string) => {
            // create a mute node that is used to stop all sound playing;
            const muteNode = new Gain(1.0);
            muteNode.toDestination();

            // create a gain node with the default volume and pass through mute node
            const gainNode = new Gain(0.8);
            gainNode.connect(muteNode);

            // create an entry for the instrument.
            samplers[instrumentKey] = {
                gain: gainNode,
                mute: muteNode,
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
                    const sampler = new Sampler().connect(gainNode);
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
                                        s.playback.instruments[instrumentKey].expressions[expressionKey].progress =
                                            pitches_complete / pitches.length;
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
                        s.playback.instruments[instrumentKey].expressions[expressionKey].status = Status.Ready;
                        s.playback.instruments[instrumentKey].progress = expressions_complete / expressions.length;
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
                Object.values(samplers[instrument_key].expressions).forEach((expression) => {
                    expression.dispose();
                });
                samplers[instrument_key].gain.dispose();
                samplers[instrument_key].mute.dispose();

                // delete the instrument entries.
                delete samplers[instrument_key];
                delete s.playback.instruments[instrument_key];
            });
        },
        mute: {
            toggle: (instrument_key: string) => {
                store.update((s) => {
                    s.playback.instruments[instrument_key].mute = !s.playback.instruments[instrument_key].mute;
                    setSamplerMuteStates(s.playback.instruments);
                });
            }
        },
        solo: {
            toggle: (instrument_key: string) => {
                store.update((s) => {
                    s.playback.instruments[instrument_key].solo = !s.playback.instruments[instrument_key].solo;
                    setSamplerMuteStates(s.playback.instruments);
                });
            }
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
