import React, { FC, useEffect, useMemo, useState } from "react";
import { mdiPlay, mdiMetronome, mdiSkipPrevious, mdiPause } from "@mdi/js";
import {
    useStore,
    actions,
    useTick,
    Tone,
    pitch_to_frequency,
    Expression,
    AbsoluteTempo,
} from "../../../store";
import { Icon } from "../../../ui";
import { store, engine } from "../../../store/use-store";
import { samplers } from "../../../store/playback";
import { transport } from "solo-composer-scheduler";

import "./styles.css";

export const TransportComponent: FC = () => {
    const [flow_key, metronome, playing] = useStore((s) => {
        const flow_key = s.ui.flow_key ? s.ui.flow_key : s.score.flows.order[0];
        return [flow_key, s.playback.metronome, s.playback.transport.playing];
    });

    useEffect(() => {
        const startCb = () => {
            store.update((s) => {
                s.playback.transport.playing = true;
            });
        };
        transport.on("start", startCb);
        const stopCb = () => {
            store.update((s) => {
                s.playback.transport.playing = false;
            });
        };
        transport.on("stop", stopCb);
        return () => {
            transport.removeListener("start", startCb);
            transport.removeListener("stop", stopCb);
        };
    }, [flow_key]);

    const tick = useTick();
    const timestamp = useMemo(() => {
        if (flow_key !== undefined) {
            return engine.tick_to_timestamp(flow_key, tick);
        } else {
            return "1:1:0.000";
        }
    }, [flow_key, tick]);

    // FIXME: this is just for testing. Think of a better way of doing this.
    // or is it?
    useEffect(() => {
        store.subscribe(
            (s) => {
                return {
                    flows: s.score.flows,
                    players: s.score.players,
                    instruments: s.score.instruments,
                    flow_key: s.ui.flow_key,
                };
            },
            ({ flows, players, instruments, flow_key }) => {
                const flow = flows.by_key[flow_key || flows.order[0]];

                // reset the transport
                transport.clear();
                transport.subdivisions = flow.subdivisions;
                transport.length = flow.length;

                Object.values(flow.master.entries.by_key).forEach((entry) => {
                    // 1) tempo changes
                    if (entry.AbsoluteTempo) {
                        const tempo = entry.AbsoluteTempo as AbsoluteTempo;
                        transport.scheduleTempoChange(
                            tempo.tick,
                            tempo.normalized_bpm
                        );
                    }
                });

                // 2) individual notes
                flow.players.forEach((playerKey) => {
                    const player = players.by_key[playerKey];
                    player.instruments.forEach((instrumentKey) => {
                        const instrument = instruments[instrumentKey];
                        instrument.staves.forEach((stave_key) => {
                            flow.staves[stave_key].tracks.forEach(
                                (track_key) => {
                                    const track = flow.tracks[track_key];
                                    Object.values(track.entries.by_key).forEach(
                                        (entry) => {
                                            if (entry.Tone) {
                                                const tone = entry.Tone as Tone;
                                                transport.scheduleEvent(
                                                    tone.tick,
                                                    tone.duration.int,
                                                    (start, stop) => {
                                                        const frequency = pitch_to_frequency(
                                                            tone.pitch.int
                                                        );
                                                        const sampler =
                                                            samplers[
                                                                instrumentKey
                                                            ].expressions[
                                                                Expression
                                                                    .Natural
                                                            ];
                                                        sampler.triggerAttack(
                                                            frequency,
                                                            start,
                                                            tone.velocity.int /
                                                                127
                                                        );
                                                        sampler.triggerRelease(
                                                            frequency,
                                                            stop
                                                        );
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }
                            );
                        });
                    });
                });
            }
        );
    }, []);

    return (
        <div className="transport">
            <div className="transport__controls">
                <Icon
                    onClick={actions.playback.transport.to_start}
                    className="transport__icon"
                    size={24}
                    path={mdiSkipPrevious}
                />
                {/* <Icon onClick={() => false} className="transport__icon" size={24} path={mdiRewind} /> */}
                {/* <Icon onClick={() => false} className="transport__icon" size={24} path={mdiFastForward} /> */}
                <Icon
                    size={24}
                    path={playing ? mdiPause : mdiPlay}
                    toggled={playing}
                    onClick={
                        playing
                            ? actions.playback.transport.stop
                            : actions.playback.transport.play
                    }
                />
            </div>
            <div className="transport__timestamp">
                <span>{timestamp}</span>
            </div>
            <div className="transport__metronome">
                <Icon
                    toggled={metronome}
                    onClick={() => actions.playback.metronome.toggle()}
                    size={24}
                    path={mdiMetronome}
                />
            </div>
        </div>
    );
};
