import React, { FC, useCallback } from "react";
import { mdiChevronDown, mdiCogOutline, mdiSizeS, mdiSizeM } from "@mdi/js";
import { Icon, noop, Label } from "../../../ui";
import { useInstrumentName, PlayerType, useCountStyle, actions, useStore } from "../../../store";
import { Text } from "../../components/text";
import { Keyboard } from "../keyboard";
import { Fader } from "../fader";

import "./styles.css";

interface Props {
    color: string;
    playerType: PlayerType;
    instrumentKey: string;
}

export const Controls: FC<Props> = ({ color, playerType, instrumentKey }) => {
    const [instrument, slots, expanded] = useStore(
        (s) => {
            const keyboard = s.ui.play.keyboard[instrumentKey];
            return [
                s.score.instruments[instrumentKey],
                keyboard ? keyboard.height : 17,
                s.ui.play.expanded[instrumentKey]
            ];
        },
        [instrumentKey]
    );
    const count_style = useCountStyle(playerType);
    const name = useInstrumentName(instrument, count_style);

    const onExpand = useCallback(() => {
        if (expanded) {
            actions.ui.play.collapse(instrument.key);
        } else {
            actions.ui.play.expand(instrument.key);
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
                                <Fader
                                    volume={instrument.volume}
                                    color={color}
                                    onChange={(volume: number) =>
                                        actions.score.instrument.volume(instrument.key, volume)
                                    }
                                />
                            </div>
                            <div className="controls__sampler-config">
                                <Icon style={{ marginRight: 20 }} path={mdiCogOutline} size={24} onClick={noop} />
                                <Label className="controls__sampler-meta">
                                    <p>Solo Sampler</p>
                                    <p>{instrument.id}</p>
                                </Label>
                            </div>
                        </div>
                        <Keyboard instrumentKey={instrument.key} height={slots} />
                    </div>
                </>
            )}
        </div>
    );
};
