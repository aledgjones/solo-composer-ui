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
                left: ticks.list[tick] ? (ticks.list[tick].x - 2) * zoom : (ticks.width - 2) * zoom
            }}
        />
    );
};
