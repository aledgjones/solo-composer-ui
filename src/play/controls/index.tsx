import React, { FC, useCallback } from "react";
import { mdiChevronDown, mdiCogOutline, mdiSizeS, mdiSizeM, mdiGraphOutline, mdiEarHearing } from "@mdi/js";
import { Icon, noop, Label, Select, Option } from "../../../ui";
import { Instrument, useInstrumentName, PlayerType, useCountStyle, actions } from "../../../store";
import { Text } from "../../components/text";
import { Keyboard } from "../keyboard";
import { Meter } from "../meter";
import { Fader } from "../fader";

import "./styles.css";

interface Props {
    color: string;
    playerType: PlayerType;
    instrument: Instrument;
    expanded: boolean;
    count: number;
    slots: number;
}

export const Controls: FC<Props> = ({ color, playerType, instrument, expanded, count, slots }) => {
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
                    path={mdiSizeS}
                    size={24}
                    onClick={() => actions.score.instrument.solo(instrument.key)}
                />
                <Icon
                    toggled={instrument.mute}
                    path={mdiSizeM}
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
                <>
                    <div className="controls__settings-wrapper">
                        <div className="controls__settings">
                            <div className="controls__settings-spacer">
                                <Meter percent={0} color={color} />
                                <Fader
                                    percent={instrument.volume}
                                    color={color}
                                    onChange={(volume: number) =>
                                        actions.score.instrument.volume(instrument.key, volume)
                                    }
                                />
                            </div>
                            <div className="controls__sampler-config">
                                <Label className="controls__sampler-meta">
                                    <p>Solo Sampler</p>
                                    <p>{instrument.id}</p>
                                </Label>
                                <Icon path={mdiCogOutline} size={24} onClick={noop} />
                            </div>
                        </div>
                        <Keyboard instrumentKey={instrument.key} height={slots} />
                    </div>
                </>
            )}
        </div>
    );
};
