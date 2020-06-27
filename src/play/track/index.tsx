import React, { FC } from "react";
import { Instrument, useStore, TickList } from "../../../store";
import { SLOT_HEIGHT } from "../const";
import { Ticks } from "../ticks";

import "./styles.css";

interface Props {
    ticks: TickList;
    instrument: Instrument;
    expanded: boolean;
}

export const Track: FC<Props> = ({ ticks, instrument, expanded }) => {
    const base = useStore((s) => s.ui.play.keyboard[instrument.key] || 76, [instrument.key]);
    return (
        <div className="track">
            <Ticks ticks={ticks} height={48} fixed={false} className="track__header" />
            {expanded && (
                <div className="track__channel" style={{ height: SLOT_HEIGHT * 24 }}>
                    <Ticks
                        className="track__channel-ticks"
                        ticks={ticks}
                        height={SLOT_HEIGHT * 24}
                        fixed={true}
                    />
                </div>
            )}
        </div>
    );
};
