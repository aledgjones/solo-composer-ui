import { get_patches, Expression } from "solo-composer-engine";
import { store } from "../use-store";
import { Status } from "../defs";
import { Transport, Player } from "solo-composer-scheduler";

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
            Transport.start();
        },
        stop: () => {
            Transport.pause();
            Player.stopAll();
        },
        to_start: () => {
            Transport.seek(0);
            Player.stopAll();
        },
    },
    instrument: {
        load: async (id: string, instrumentKey: string) => {
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

            const instrument = Player.createSampler(instrumentKey);

            const map: { [expression: number]: string } = get_patches(id);
            let expressions = Object.entries(map);

            await Promise.all(
                expressions.map(async ([exp, url]) => {
                    const expression = parseInt(exp);
                    store.update((s) => {
                        s.playback.instruments[instrumentKey].expressions[
                            expression
                        ] = {
                            key: expression,
                            status: Status.Pending,
                            progress: 0,
                        };
                    });
                    await instrument.load(
                        parseInt(exp),
                        url,
                        (total, progress) => {
                            store.update((s) => {
                                s.playback.instruments[
                                    instrumentKey
                                ].expressions[expression].progress =
                                    progress / total;
                            });
                        }
                    );
                    store.update((s) => {
                        s.playback.instruments[instrumentKey].expressions[
                            expression
                        ].status = Status.Ready;
                    });
                })
            );

            // all expressions for this instrument are loaded so set instrument to ready.
            store.update((s) => {
                s.playback.instruments[instrumentKey].status = Status.Ready;
            });
        },
        audition: (instrument_key: string, pitch: number) => {
            Player.play(
                instrument_key,
                Expression.Natural,
                pitch,
                Player.ctx.currentTime,
                0.5
            );
        },
        destroy: (instrument_key: string) => {
            store.update((s) => {
                delete s.playback.instruments[instrument_key];
                Player.disconnect(instrument_key);
            });
        },
        destroyAll: () => {
            store.update((s) => {
                Object.keys(s.playback.instruments).forEach((key) => {
                    delete s.playback.instruments[key];
                    Player.disconnect(key);
                });
            });
        },
        mute: {
            toggle: (instrument_key: string) => {
                store.update((s) => {
                    const muted = s.playback.instruments[instrument_key].mute;
                    s.playback.instruments[instrument_key].mute = !muted;
                    if (muted) {
                        Player.unmute(instrument_key);
                    } else {
                        Player.mute(instrument_key);
                    }
                });
            },
        },
        solo: {
            toggle: (instrument_key: string) => {
                store.update((s) => {
                    const solo = s.playback.instruments[instrument_key].solo;
                    s.playback.instruments[instrument_key].solo = !solo;
                    if (solo) {
                        Player.unsolo(instrument_key);
                    } else {
                        Player.solo(instrument_key);
                    }
                });
            },
        },
        /**
         * Set the volume (0 - 100)
         */
        volume: (instrument_key: string, volume: number) => {
            store.update((s) => {
                const value = parseInt(volume.toFixed(0));
                s.playback.instruments[instrument_key].volume = value;
                Player.volume(instrument_key, value / 100);
            });
        },
    },
};
