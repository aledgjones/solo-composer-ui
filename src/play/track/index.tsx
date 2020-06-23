import React, { FC } from "react";
import { Instrument, useStore } from "../../../store";
import { SLOT_HEIGHT } from "../const";

import "./styles.css";

interface Props {
    instrument: Instrument;
    expanded: boolean;
}

export const Track: FC<Props> = ({ instrument, expanded }) => {
    const base = useStore((s) => s.ui.keyboard[instrument.key] || 76, [instrument.key]);
    return (
        <div className="track">
            <div className="track__header" />
            {expanded && <div className="track__channel" style={{ height: SLOT_HEIGHT * 24 + 1 }}></div>}
        </div>
    );
};
