import React, { FC } from "react";
import { mdiPlay, mdiMetronome, mdiFastForward, mdiRewind, mdiSkipPrevious } from "@mdi/js";
import { useStore, actions } from "../../../store";
import { Icon } from "../../../ui";

import "./styles.css";

export const Transport: FC = () => {
    const metronome = useStore((s) => s.playback.metronome);

    return (
        <div className="transport">
            <div className="transport__controls">
                <Icon onClick={() => false} className="transport__icon" size={24} path={mdiSkipPrevious} />
                <Icon onClick={() => false} className="transport__icon" size={24} path={mdiRewind} />
                <Icon onClick={() => false} className="transport__icon" size={24} path={mdiFastForward} />
                <Icon onClick={() => false} size={24} path={mdiPlay} />
            </div>
            <div className="transport__timestamp">
                <span>0.0.0.000</span>
            </div>
            <div className="transport__metronome">
                <Icon
                    toggled={metronome}
                    onClick={() => actions.playback.metronome(!metronome)}
                    size={24}
                    path={mdiMetronome}
                />
            </div>
        </div>
    );
};
