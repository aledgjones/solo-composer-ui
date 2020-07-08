import React, { useMemo, PointerEvent, useCallback } from "react";
import { TickList, Tone, Tool } from "../../../store";
import { FC } from "react";
import { SLOT_HEIGHT } from "../const";

import "./styles.css";

// TODO: write a should render function: is ticks in view?
function shouldDraw(pitch: number, base: number, slots: number) {
    if (pitch > base) {
        return false;
    }

    if (pitch <= base - slots) {
        return false;
    }

    return true;
}

interface Props {
    color: string;
    border: string;
    base: number;
    slots: number;
    tone: Tone;
    ticks: TickList;
    tool: Tool;
    onSelect: (key: string) => void;
    onRemove: (key: string) => void;
    onEdit: (
        e: PointerEvent<HTMLElement>,
        toneKey: string,
        start: number,
        duration: number,
        pitch: number,
        fixedStart: boolean,
        fixedDuration: boolean,
        fixedPitch: boolean
    ) => void;
    onSlice: (e: PointerEvent<HTMLElement>, toneKey: string, start: number, duration: number) => void;
}

export const ToneTrackEntry: FC<Props> = ({
    color,
    border,
    base,
    slots,
    tone,
    ticks,
    tool,
    onSelect,
    onRemove,
    onEdit,
    onSlice
}) => {
    const left = useMemo(() => {
        if (tone.tick >= ticks.list.length) {
            return ticks.width;
        } else {
            return ticks.list[tone.tick].x;
        }
    }, [tone, ticks]);

    const width = useMemo(() => {
        if (tone.tick + tone.duration.int >= ticks.list.length) {
            return ticks.width - left;
        } else {
            return ticks.list[tone.tick + tone.duration.int].x - left;
        }
    }, [tone, ticks, left]);

    const actionMain = useCallback(
        (e) => {
            if (tool === Tool.Select) {
                onSelect(tone.key);
            }
            if (tool === Tool.Erase) {
                onRemove(tone.key);
            }
            if (tool === Tool.Slice) {
                onSlice(e, tone.key, tone.tick, tone.duration.int);
            }
        },
        [tone, onSelect, onRemove, onSlice]
    );

    const actionWest = useCallback(
        (e: PointerEvent<HTMLElement>) =>
            onEdit(e, tone.key, tone.tick, tone.duration.int, tone.pitch.int, false, false, true),
        [tone, onEdit]
    );

    const action = useCallback(
        (e: PointerEvent<HTMLElement>) =>
            onEdit(e, tone.key, tone.tick, tone.duration.int, tone.pitch.int, false, true, false),
        [tone, onEdit]
    );

    const actionEast = useCallback(
        (e: PointerEvent<HTMLElement>) =>
            onEdit(e, tone.key, tone.tick, tone.duration.int, tone.pitch.int, true, false, true),
        [tone, onEdit]
    );

    if (shouldDraw(tone.pitch.int, base, slots)) {
        return (
            <div
                className="tone-track-entry no-scroll"
                style={{
                    position: "absolute",
                    top: (base - tone.pitch.int) * SLOT_HEIGHT,
                    left,
                    width,
                    height: SLOT_HEIGHT,
                    backgroundColor: color,
                    border: `1px solid ${border}`
                }}
                onPointerDown={actionMain}
            >
                {tool === Tool.Select && (
                    <>
                        <div
                            className="tone-track-entry__handle tone-track-entry__handle--w"
                            onPointerDown={actionWest}
                        />
                        <div
                            className="tone-track-entry__handle tone-track-entry__handle--move"
                            onPointerDown={action}
                        />
                        <div
                            className="tone-track-entry__handle tone-track-entry__handle--e"
                            onPointerDown={actionEast}
                        />
                    </>
                )}
            </div>
        );
    } else {
        return null;
    }
};
