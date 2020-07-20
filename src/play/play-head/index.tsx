import React, { FC } from "react";
import { TickList, useTick } from "../../../store";

import "./styles.css";

interface Props {
    ticks: TickList;
    zoom: number;
}

export const PlayHead: FC<Props> = ({ ticks, zoom }) => {
    const tick = useTick();

    return (
        <div
            className="play-head"
            style={{
                transform: `translate3d(${
                    ticks.list[tick]
                        ? ticks.list[tick].x * zoom - 1
                        : ticks.width * zoom - 1
                }px, 0, 0)`,
            }}
        />
    );
};
