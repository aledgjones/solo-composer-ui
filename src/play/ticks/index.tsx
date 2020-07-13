import React, { Fragment, memo } from "react";
import { TickList, Tick } from "../../../store";
import { FC } from "react";
import { merge } from "../../../ui";

function tickHeight(tick: Tick, isTrack: boolean, height: number, zoom: number) {
    if (tick.is_first_beat) {
        return height;
    } else if (tick.is_grouping_boundry) {
        return isTrack ? height : height / 2;
    } else if (tick.is_beat) {
        return isTrack ? height : height / 3;
    } else if (tick.is_quaver_beat) {
        if (zoom >= 0.5) {
            return isTrack ? height : height / 6;
        } else {
            return 0;
        }
    } else {
        return undefined;
    }
}

function tickColor(tick: Tick, isTrack: boolean) {
    if (!isTrack) {
        return "var(--background-1000)";
    } else {
        if (tick.is_first_beat) {
            return "var(--background-200)";
        } else if (tick.is_beat) {
            return "var(--background-500)";
        } else if (tick.is_quaver_beat) {
            return "var(--background-600)";
        } else {
            return undefined;
        }
    }
}

interface Props {
    className?: string;
    ticks: TickList;
    height: number;
    isTrack: boolean;
    zoom: number;
}

export const Ticks: FC<Props> = memo(({ className, ticks, height, isTrack, zoom }) => {
    let bar = 0;
    return (
        <svg
            viewBox={`0 0 ${ticks.width * zoom} ${height}`}
            className={merge("ticks", className)}
            style={{ width: ticks.width * zoom, height }}
        >
            {ticks.list.map((tick, i) => {
                const tick_height = tickHeight(tick, isTrack, height, zoom);
                if (tick_height) {
                    const tick_color = tickColor(tick, isTrack);
                    if (tick.is_first_beat) {
                        bar++;
                    }
                    return (
                        <Fragment key={i}>
                            <line
                                x1={tick.x * zoom}
                                y1="0"
                                x2={tick.x * zoom}
                                y2={tick_height}
                                strokeWidth="1"
                                stroke={tick_color}
                            />
                            {!isTrack && tick.is_first_beat && (
                                <text
                                    x={tick.x * zoom + 5}
                                    y={12}
                                    fill="var(--background-1000)"
                                    fontSize="10"
                                    fontFamily="Roboto"
                                >
                                    {bar}
                                </text>
                            )}
                        </Fragment>
                    );
                } else {
                    return null;
                }
            })}
        </svg>
    );
});
