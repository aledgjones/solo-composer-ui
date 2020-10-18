import React, { FC, useEffect } from "react";
import { mdiPlay, mdiMetronome, mdiSkipPrevious, mdiPause } from "@mdi/js";
import { Transport, Player } from "solo-composer-scheduler";
import { Icon } from "../../../ui";
import { Expression } from "../../store/score-instrument/defs";
import { actions } from "../../store/actions";
import { useStore, store } from "../../store/use-store";
import { useTick, useTimestamp } from "../../store/playback";
import { EntryType, Articulation } from "../../store/entries";
import { AbsoluteTempo } from "../../store/entries/absolute-tempo/defs";
import { normalize_bpm } from "../../store/entries/absolute-tempo/utils";
import { Tone } from "../../store/entries/tone/defs";

import "./styles.css";

export const TransportComponent: FC = () => {
    const [flow_key, metronome, playing] = useStore((s) => [
        s.ui.flow_key,
        s.playback.metronome,
        s.playback.transport.playing,
    ]);

    useEffect(() => {
        const startCb = () => {
            store.update((s) => {
                s.playback.transport.playing = true;
            });
        };
        Transport.on("start", startCb);
        const stopCb = () => {
            store.update((s) => {
                s.playback.transport.playing = false;
            });
        };
        Transport.on("stop", stopCb);
        return () => {
            Transport.removeListener("start", startCb);
            Transport.removeListener("stop", stopCb);
        };
    }, [flow_key]);

    const tick = useTick();
    const timestamp = useTimestamp(tick, flow_key);

    // FIXME: this is just for testing. Think of a better way of doing this.
    // or is it? This seems to work okay for now actually!
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

                // reset the Transport
                Transport.clear();
                Transport.subdivisions = flow.subdivisions;
                Transport.length = flow.length;

                Object.values(flow.master.entries.by_key).forEach((entry) => {
                    // 1) tempo changes
                    if (entry.type === EntryType.AbsoluteTempo) {
                        const tempo = entry as AbsoluteTempo;
                        Transport.scheduleTempoChange(
                            tempo.tick,
                            normalize_bpm(tempo)
                        );
                    }
                });

                // 2) individual notes
                Object.keys(flow.players).forEach((playerKey) => {
                    const player = players.by_key[playerKey];
                    player.instruments.forEach((instrumentKey) => {
                        const instrument = instruments[instrumentKey];
                        instrument.staves.forEach((stave_key) => {
                            flow.staves[stave_key].tracks.order.forEach(
                                (track_key) => {
                                    const track =
                                        flow.staves[stave_key].tracks.by_key[
                                            track_key
                                        ];
                                    Object.values(track.entries.by_key).forEach(
                                        (entry) => {
                                            if (entry.type === EntryType.Tone) {
                                                const tone = entry as Tone;
                                                Transport.scheduleEvent(
                                                    tone.tick,
                                                    tone.duration,
                                                    (when, duration) => {
                                                        Player.play(
                                                            instrumentKey,
                                                            tone.articulation ===
                                                                Articulation.Staccato
                                                                ? Expression.Staccato
                                                                : Expression.Natural,
                                                            tone.pitch.int,
                                                            when,
                                                            duration
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
