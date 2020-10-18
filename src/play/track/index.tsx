import React, { FC, useMemo } from "react";
import { merge } from "../../../ui";
import { SLOT_HEIGHT } from "../const";
import { Ticks } from "../ticks";
import { Slots } from "../keyboard/slots";
import { ToneTrack } from "../tone-track";
import { OverviewTrack } from "../overview-track";
import { useStore } from "../../store/use-store";
import { TickList } from "../../store/score-flow/defs";
import { Tool } from "../../store/ui/defs";

import "./styles.css";

interface Props {
    flowKey: string;
    instrumentKey: string;
    color: string;
    ticks: TickList;
    zoom: number;
}

export const Track: FC<Props> = ({
    flowKey,
    instrumentKey,
    color,
    ticks,
    zoom,
}) => {
    const [expanded, tool, slots, base, playing] = useStore(
        (s) => {
            const keyboard = s.ui.play.keyboard[instrumentKey];
            return [
                s.ui.play.expanded[instrumentKey],
                s.ui.play.tool,
                keyboard ? keyboard.height : 17,
                keyboard ? keyboard.base : 76,
                s.playback.transport.playing,
            ];
        },
        [instrumentKey]
    );

    return (
        <div className="track">
            <Ticks
                isTrack={true}
                ticks={ticks}
                height={48}
                className="track__header"
                zoom={zoom}
            />
            {!expanded && (
                <OverviewTrack
                    color={color}
                    flowKey={flowKey}
                    instrumentKey={instrumentKey}
                    ticks={ticks}
                    zoom={zoom}
                />
            )}
            {expanded && (
                <>
                    <div
                        className={merge("track__tone-channel", {
                            "no-scroll": tool !== Tool.Select,
                        })}
                        style={{ height: SLOT_HEIGHT * slots }}
                    >
                        <Slots
                            style={{ width: ticks.width * zoom }}
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
                            zoom={zoom}
                        />
                        <ToneTrack
                            color={color}
                            flowKey={flowKey}
                            instrumentKey={instrumentKey}
                            ticks={ticks}
                            base={base}
                            tool={tool}
                            slots={slots}
                            zoom={zoom}
                        />
                    </div>
                </>
            )}
        </div>
    );
};
