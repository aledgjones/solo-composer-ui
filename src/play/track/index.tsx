import React, { FC, useMemo } from "react";
import { merge } from "../../../ui";
import { useStore, TickList, Tool, useTick } from "../../../store";
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
    zoom: number;
}

export const Track: FC<Props> = ({ flowKey, instrumentKey, color, ticks, zoom }) => {
    const [expanded, tool, slots, base, playing] = useStore(
        (s) => {
            const keyboard = s.ui.play.keyboard[instrumentKey];
            return [
                s.ui.play.expanded[instrumentKey],
                s.ui.play.tool,
                keyboard ? keyboard.height : 17,
                keyboard ? keyboard.base : 76,
                s.playback.transport.playing
            ];
        },
        [instrumentKey]
    );

    const tick = useTick();

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
            <div
                className="track__tick-bar"
                style={{
                    transform: `translateX(${
                        ticks.list[tick] ? (ticks.list[tick].x - 2) * zoom : (ticks.width - 2) * zoom
                    }px)`
                }}
            />

            <Ticks isTrack={false} ticks={ticks} height={48} className="track__header" zoom={zoom} />
            {expanded && (
                <>
                    <div
                        className={merge("track__tone-channel", { "no-scroll": tool !== Tool.Select })}
                        style={{ height: SLOT_HEIGHT * slots, cursor }}
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
