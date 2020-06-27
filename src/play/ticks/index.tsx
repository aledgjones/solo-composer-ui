import React from "react";
import { TickList, Tick } from "../../../store";
import { FC } from "react";
import { merge } from "../../../ui";

function tickHeight(tick: Tick, fixed: boolean, height: number) {
    if (tick.is_first_beat) {
        return height;
    }

    if (tick.is_grouping_boundry) {
        return fixed ? height : 24;
    }

    if (tick.is_beat) {
        return fixed ? height : 16;
    }

    if (tick.is_quaver_beat) {
        return fixed ? 0 : 8;
    }

    return 0;
}

interface Props {
    ticks: TickList;
    height: number;
    fixed: boolean;
    className?: string;
}

export const Ticks: FC<Props> = ({ ticks, height, fixed, className }) => {
    return (
        <svg
            viewBox={`0 0 ${ticks.width} ${height}`}
            className={merge("ticks", className)}
            style={{ width: ticks.width, height }}
        >
            {ticks.list.map((tick, i) => {
                const y = tickHeight(tick, fixed, height);
                if (y > 0) {
                    return <line key={i} x1={tick.x} y1="0" x2={tick.x} y2={y} strokeWidth="2" stroke="currentColor" />;
                } else {
                    return null;
                }
            })}
        </svg>
    );
};
