import React, { FC, useCallback } from "react";
import { mdiChevronDown, mdiCogOutline, mdiVolumeHigh } from "@mdi/js";
import { Icon, noop, Label } from "../../../ui";
import { Instrument, useInstrumentName, PlayerType, useCountStyle, actions } from "../../../store";
import { Text } from "../../components/text";
import { Keyboard } from "../keyboard";
import { Meter } from "../meter";
import { Fader } from "../fader";

const mute =
    "m12.055 15.986 4.5569-11.363h2.3742v13.939h-1.8381v-5.4376l0.18189-5.8301-4.5856 11.268h-1.3977l-4.576-11.287 0.18189 5.8493v5.4376h-1.8381v-13.939h2.3742z";
const solo =
    "m14.93 15.038q0-0.95732-0.65098-1.5317-0.64141-0.5744-2.7092-1.1775-2.0678-0.61269-3.274-1.5509-1.1967-0.94775-1.1967-2.5561 0-1.6275 1.2924-2.7092 1.302-1.0818 3.4464-1.0818 2.355 0 3.6283 1.2924 1.2828 1.2924 1.2828 2.9198h-1.8381q0-1.1679-0.75629-1.9338t-2.3167-0.76586q-1.4743 0-2.1827 0.65098-0.70842 0.64141-0.70842 1.6083 0 0.87117 0.74671 1.4551 0.75629 0.57439 2.4508 1.0531 2.422 0.6797 3.5325 1.6849 1.1105 0.99562 1.1105 2.6231 0 1.704-1.3307 2.7188t-3.5325 1.0148q-1.2828 0-2.4986-0.47866-1.2062-0.47866-1.9912-1.4168-0.77543-0.94775-0.77543-2.3359h1.8381q0 1.4264 1.0435 2.0774 1.0435 0.65098 2.3837 0.65098 1.4456 0 2.221-0.59354 0.78501-0.60312 0.78501-1.6179z";

import "./styles.css";

interface Props {
    color: string;
    playerType: PlayerType;
    instrument: Instrument;
    expanded: boolean;
    count: number;
}

export const Controls: FC<Props> = ({ color, playerType, instrument, expanded, count }) => {
    const count_style = useCountStyle(playerType);
    const name = useInstrumentName(instrument, count, count_style);

    const onExpand = useCallback(() => {
        if (expanded) {
            actions.ui.collapse(instrument.key + "-instrument");
        } else {
            actions.ui.expand(instrument.key + "-instrument");
        }
    }, [expanded]);

    return (
        <div className="controls">
            <div className="controls__color" style={{ backgroundColor: color }} />
            <div className="controls__header">
                <p className="controls__name">
                    <Text content={name} />
                </p>
                <Icon
                    toggled={instrument.solo}
                    style={{ marginRight: 12 }}
                    path={solo}
                    size={24}
                    onClick={() => actions.score.instrument.solo(instrument.key)}
                />
                <Icon
                    toggled={instrument.mute}
                    path={mute}
                    size={24}
                    onClick={() => actions.score.instrument.mute(instrument.key)}
                />
                <Icon
                    style={{ marginLeft: 12, transform: `rotateZ(${expanded ? "180deg" : "0"})` }}
                    size={24}
                    path={mdiChevronDown}
                    onClick={onExpand}
                />
            </div>
            {expanded && (
                <div className="controls__settings-wrapper">
                    <div className="controls__settings">
                        <div className="controls__settings-spacer">
                            <Meter percent={0} />
                            <Fader
                                percent={instrument.volume}
                                onChange={(volume: number) => actions.score.instrument.volume(instrument.key, volume)}
                            />
                        </div>
                        <div className="controls__sampler-config">
                            <Label className="controls__sampler-meta">
                                <p>Solo Sampler</p>
                                <p>{instrument.id}</p>
                            </Label>
                            <Icon style={{ marginRight: 12 }} path={mdiVolumeHigh} size={24} onClick={noop} />
                            <Icon path={mdiCogOutline} size={24} onClick={noop} />
                        </div>
                    </div>
                    <Keyboard instrumentKey={instrument.key} height={24} />
                </div>
            )}
        </div>
    );
};
