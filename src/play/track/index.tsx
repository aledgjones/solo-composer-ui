import React, { FC, useMemo } from "react";
import { merge } from "../../../ui";
import { useStore, TickList, Tool, Instrument } from "../../../store";
import { SLOT_HEIGHT } from "../const";
import { Ticks } from "../ticks";
import { Slots } from "../keyboard/slots";
import { ToneTrack } from "../tone-track";

import "./styles.css";

import pencil from "../../assets/pencil.svg";
import knife from "../../assets/knife.svg";
import eraser from "../../assets/eraser.svg";

interface Props {
    flowKey: string;
    instrumentKey: string;
    color: string;
    ticks: TickList;
}

export const Track: FC<Props> = ({ flowKey, instrumentKey, color, ticks }) => {
    const [expanded, tool, slots, base] = useStore(
        (s) => {
            const keyboard = s.ui.play.keyboard[instrumentKey];
            return [
                s.ui.play.expanded[instrumentKey],
                s.ui.play.tool,
                keyboard ? keyboard.height : 17,
                keyboard ? keyboard.base : 76
            ];
        },
        [instrumentKey]
    );

    const cursor = useMemo(() => {
        switch (tool) {
            case Tool.Draw:
                return `url(${pencil}) 4 20, default`;
            case Tool.Erase:
                return `url(${eraser}) 4 20, default`;
            case Tool.Slice:
                return `url(${knife}) 4 20, default`;
            default:
                return "default";
        }
    }, [tool]);

    return (
        <div className="track">
            <Ticks isTrack={false} ticks={ticks} height={48} className="track__header" />
            {expanded && (
                <>
                    <div
                        className={merge("track__tone-channel", { "no-scroll": tool !== Tool.Select })}
                        style={{ height: SLOT_HEIGHT * slots, cursor }}
                    >
                        <Slots
                            style={{ width: ticks.width }}
                            className="track__tone-channel-slots"
                            base={base}
                            count={slots}
                            isKeyboard={false}
                        />
                        <Ticks
                            isTrack={true}
                            className="track__tone-channel-ticks"
                            ticks={ticks}
                            height={SLOT_HEIGHT * slots}
                        />
                        <ToneTrack
                            color={color}
                            flowKey={flowKey}
                            instrumentKey={instrumentKey}
                            ticks={ticks}
                            base={base}
                            tool={tool}
                            slots={slots}
                        />
                    </div>
                </>
            )}
        </div>
    );
};
