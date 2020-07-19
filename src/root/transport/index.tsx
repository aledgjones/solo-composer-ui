import React, { FC, useEffect, useMemo } from "react";
import { mdiPlay, mdiMetronome, mdiSkipPrevious, mdiPause } from "@mdi/js";
import { Transport } from "tone";
import { useStore, actions, useTick, Tone, pitch_to_frequency, Expression } from "../../../store";
import { Icon } from "../../../ui";
import { store, engine } from "../../../store/use-store";
import { samplers } from "../../../store/playback";

import "./styles.css";

export const TransportComponent: FC = () => {
    const [flow_key, metronome, playing] = useStore((s) => {
        const flow_key = s.ui.flow_key ? s.ui.flow_key : s.score.flows.order[0];
        return [flow_key, s.playback.metronome, s.playback.transport.playing];
    });
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
                    flow_key: s.ui.flow_key
                };
            },
            ({ flows, players, instruments, flow_key }) => {
                Transport.cancel(0);

                const flow = flows.by_key[flow_key || flows.order[0]];

                flow.players.forEach((playerKey) => {
                    const player = players.by_key[playerKey];
                    player.instruments.forEach((instrumentKey) => {
                        const instrument = instruments[instrumentKey];
                        instrument.staves.forEach((stave_key) => {
                            flow.staves[stave_key].tracks.forEach((track_key) => {
                                const track = flow.tracks[track_key];
                                Object.values(track.entries.by_key).forEach((entry) => {
                                    if (entry.Tone) {
                                        const tone = entry.Tone as Tone;
                                        Transport.schedule((time) => {
                                            const frequency = pitch_to_frequency(tone.pitch.int);
                                            samplers[instrumentKey].expressions[
                                                Expression.Natural
                                            ].triggerAttackRelease(
                                                frequency,
                                                `${tone.duration.int}i`,
                                                time,
                                                tone.velocity.int / 127
                                            );
                                        }, `${tone.tick}i`);
                                    }
                                });
                            });
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
                    onClick={playing ? actions.playback.transport.stop : actions.playback.transport.play}
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
