import React, { FC, PointerEvent, useRef, useCallback } from "react";
import {
    TickList,
    useStore,
    Tone,
    Tool,
    actions,
    duration_to_ticks,
    pitch_to_frequency,
    Expression,
} from "../../../store";
import { dragHandler } from "../../../ui";
import { ToneTrackEntry } from "../tone-track-entry";
import { SLOT_HEIGHT } from "../const";
import {
    getTickFromXPosition,
    getPitchFromYPosition,
    getStartOfTone,
    getDurationOfTone,
} from "../utils";

import "./styles.css";
import { Player } from "solo-composer-scheduler";

interface Props {
    flowKey: string;
    instrumentKey: string;
    color: string;
    ticks: TickList;
    base: number;
    tool: Tool;
    slots: number;
    zoom: number;
}

export const ToneTrack: FC<Props> = ({
    flowKey,
    instrumentKey,
    color,
    base,
    tool,
    ticks,
    slots,
    zoom,
}) => {
    const track = useRef<HTMLDivElement>(null);

    const [audition, snap, tones, trackKey] = useStore(
        (s) => {
            const flow = s.score.flows.by_key[flowKey];
            const instrument = s.score.instruments[instrumentKey];

            // TODO: make trackKey dynamic so it can be selectable by user
            // == delete ==
            const stave = flow.staves[instrument.staves[0]];
            const trackKey = stave.tracks[0];
            // == delete ==

            return [
                s.app.audition,
                duration_to_ticks(
                    s.score.flows.by_key[flowKey].subdivisions,
                    s.ui.snap
                ),
                instrument.staves.reduce<Tone[]>((out, stave_key) => {
                    flow.staves[stave_key].tracks.forEach((track_key) => {
                        const track = flow.tracks[track_key];
                        Object.values(track.entries.by_key).forEach((entry) => {
                            if (entry.Tone) {
                                out.push(entry.Tone as Tone);
                            }
                        });
                    });
                    return out;
                }, []),
                trackKey,
            ];
        },
        [flowKey, instrumentKey]
    );

    const onAudition = useCallback(
        (pitch: number) => {
            if (audition) {
                actions.playback.instrument.audition(instrumentKey, pitch);
            }
        },
        [instrumentKey, audition]
    );

    const onCreate = useCallback(
        (e: PointerEvent<HTMLDivElement>) => {
            if (track.current && tool === Tool.Draw) {
                const box = track.current.getBoundingClientRect();
                const x = e.clientX - box.left;
                const y = e.clientY - box.top;
                const start = getTickFromXPosition(
                    x,
                    ticks,
                    snap,
                    zoom,
                    "down"
                );
                const duration =
                    getTickFromXPosition(x, ticks, snap, zoom) - start;
                const pitch = getPitchFromYPosition(y, base, slots);
                const toneKey = actions.score.entries.tone.create(
                    flowKey,
                    trackKey,
                    start,
                    duration,
                    pitch,
                    100
                );

                actions.ui.play.selection.clear();
                actions.ui.play.selection.select(toneKey);

                onEdit(e, toneKey, start, duration, pitch, true, false, true);
                onAudition(pitch);
            }

            if (tool === Tool.Select) {
                actions.ui.play.selection.clear();
            }
        },
        [
            flowKey,
            instrumentKey,
            trackKey,
            track,
            ticks,
            base,
            slots,
            tool,
            snap,
            audition,
            zoom,
            onAudition,
        ]
    );

    const onEdit = useCallback(
        (
            e: PointerEvent<HTMLElement>,
            toneKey: string,
            start: number,
            duration: number,
            pitch: number,
            fixedStart: boolean,
            fixedDuration: boolean,
            fixedPitch: boolean
        ) => {
            const handler = dragHandler<{ box: DOMRect; x: number }>({
                onDown: (ev) => {
                    if (track.current) {
                        const box = track.current.getBoundingClientRect();
                        return {
                            box,
                            x: ev.clientX - box.left,
                        };
                    } else {
                        return false;
                    }
                },
                onMove: (ev, init) => {
                    const x = ev.clientX - init.box.left;
                    const y = ev.clientY - init.box.top;

                    const p = fixedPitch
                        ? pitch
                        : getPitchFromYPosition(y, base, slots);
                    const s = getStartOfTone(
                        x,
                        init.x,
                        ticks,
                        snap,
                        zoom,
                        start,
                        duration,
                        fixedStart,
                        fixedDuration
                    );
                    const d = getDurationOfTone(
                        x,
                        ticks,
                        snap,
                        zoom,
                        start,
                        duration,
                        fixedStart,
                        fixedDuration
                    );
                    actions.score.entries.tone.update(
                        flowKey,
                        trackKey,
                        toneKey,
                        s,
                        d,
                        p
                    );
                },
                onEnd: (ev, init) => {
                    const x = ev.clientX - init.box.left;
                    const y = ev.clientY - init.box.top;
                    const p = fixedPitch
                        ? pitch
                        : getPitchFromYPosition(y, base, slots);
                    const d = getDurationOfTone(
                        x,
                        ticks,
                        snap,
                        zoom,
                        start,
                        duration,
                        fixedStart,
                        fixedDuration
                    );
                    if (p !== pitch) {
                        onAudition(p);
                    }
                    if (d <= 0) {
                        actions.score.entries.tone.remove(
                            flowKey,
                            trackKey,
                            toneKey
                        );
                    }
                },
            });

            handler(e);
        },
        [
            flowKey,
            instrumentKey,
            trackKey,
            track,
            ticks,
            base,
            slots,
            snap,
            audition,
            zoom,
            onAudition,
        ]
    );

    const onSlice = useCallback(
        (
            e: PointerEvent<HTMLDivElement>,
            toneKey: string,
            start: number,
            duration: number
        ) => {
            const box = track.current.getBoundingClientRect();
            const x = e.clientX - box.left;
            const slice = getTickFromXPosition(x, ticks, snap, zoom);

            if (slice > start && slice < start + duration) {
                actions.ui.play.selection.clear();
                actions.score.entries.tone.slice(
                    flowKey,
                    trackKey,
                    toneKey,
                    slice
                );
            }
        },
        [flowKey, trackKey, ticks, snap, zoom]
    );

    const onRemove = useCallback(
        (key: string) => {
            actions.ui.play.selection.clear();
            actions.score.entries.tone.remove(flowKey, trackKey, key);
        },
        [flowKey, trackKey]
    );

    return (
        <div
            ref={track}
            onPointerDown={onCreate}
            className="tone-track"
            style={{ width: ticks.width * zoom, height: SLOT_HEIGHT * slots }}
        >
            {tones.map((tone) => {
                return (
                    <ToneTrackEntry
                        key={tone.key}
                        color={color}
                        base={base}
                        slots={slots}
                        tone={tone}
                        ticks={ticks}
                        tool={tool}
                        zoom={zoom}
                        onRemove={onRemove}
                        onEdit={onEdit}
                        onSlice={onSlice}
                        onAudition={onAudition}
                    />
                );
            })}
        </div>
    );
};
