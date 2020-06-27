import React, { Fragment } from "react";
import { TickList, Tick } from "../../../store";
import { FC } from "react";
import { merge } from "../../../ui";

function tickHeight(tick: Tick, fixed: boolean, height: number, i: number) {
    if (i === 0) {
        return 0;
    }

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
    let bar = 0;
    return (
        <svg
            viewBox={`0 0 ${ticks.width} ${height}`}
            className={merge("ticks", className)}
            style={{ width: ticks.width, height }}
        >
            {ticks.list.map((tick, i) => {
                const y = tickHeight(tick, fixed, height, i);
                if (tick.is_first_beat) {
                    bar++;
                }
                if (y > 0) {
                    return (
                        <Fragment key={i}>
                            <line
                                x1={tick.x}
                                y1="0"
                                x2={tick.x}
                                y2={y}
                                strokeWidth="1"
                                stroke="currentColor"
                            />
                            {!fixed && tick.is_first_beat && (
                                <text
                                    x={tick.x + 5}
                                    y="12"
                                    fill="currentColor"
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
};
