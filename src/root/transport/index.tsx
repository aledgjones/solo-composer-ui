import React, { FC, useEffect } from "react";
import { mdiPlay, mdiMetronome, mdiFastForward, mdiRewind, mdiSkipPrevious } from "@mdi/js";
import { useStore, actions } from "../../../store";
import { Icon } from "../../../ui";

import "./styles.css";

export const Transport: FC = () => {
    const [metronome, transport] = useStore((s) => [s.playback.metronome, s.playback.transport]);

    useEffect(() => {
        transport.on("start", () => {
            console.log(transport);
        });
    }, [transport]);

    return (
        <div className="transport">
            <div className="transport__controls">
                <Icon onClick={() => false} className="transport__icon" size={24} path={mdiSkipPrevious} />
                <Icon onClick={() => false} className="transport__icon" size={24} path={mdiRewind} />
                <Icon onClick={() => false} className="transport__icon" size={24} path={mdiFastForward} />
                <Icon size={24} path={mdiPlay} onClick={() => transport.toggle()} />
            </div>
            <div className="transport__timestamp">
                <span>0.0.0.000</span>
            </div>
            <div className="transport__metronome">
                <Icon
                    toggled={metronome}
                    onClick={() => actions.playback.metronome.toggle()}
                    size={24}
                    path={mdiMetronome}
                />
            </div>
        </div>
    );
};
