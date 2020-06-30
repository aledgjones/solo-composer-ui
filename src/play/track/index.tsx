import React, { FC } from "react";
import { Instrument, useStore, TickList } from "../../../store";
import { SLOT_HEIGHT } from "../const";
import { Ticks } from "../ticks";
import { Slots } from "../keyboard/slots";

import "./styles.css";

interface Props {
    ticks: TickList;
    instrument: Instrument;
    expanded: boolean;
    slots: number;
}

export const Track: FC<Props> = ({ ticks, instrument, expanded, slots }) => {
    const base = useStore((s) => s.ui.play.keyboard[instrument.key] || 76, [instrument.key]);
    return (
        <div className="track">
            <Ticks isTrack={false} ticks={ticks} height={48} fixed={false} className="track__header" />
            {expanded && (
                <div className="track__channel" style={{ height: SLOT_HEIGHT * slots }}>
                    <Slots
                        style={{ width: ticks.width }}
                        className="track__channel-slots"
                        base={base}
                        count={slots}
                        isKeyboard={false}
                    />
                    <Ticks
                        isTrack={true}
                        className="track__channel-ticks"
                        ticks={ticks}
                        height={SLOT_HEIGHT * slots}
                        fixed={true}
                    />
                </div>
            )}
        </div>
    );
};
