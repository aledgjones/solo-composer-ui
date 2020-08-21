import React, { FC, useRef } from "react";
import { mdiDeleteOutline, mdiDrag } from "@mdi/js";
import { SortableItem, Icon, merge } from "../../../ui";
import { Text } from "../../components/text";
import {
    Instrument,
    AutoCountStyle,
    instrumentName,
    actions,
} from "../../../store";

import "./styles.css";

interface Props {
    index: number;
    selected: boolean;
    instrument: Instrument;
    player_key: string;
    count?: number;
    count_style: AutoCountStyle;

    onSelect: () => void;
}

export const InstrumentItem: FC<Props> = ({
    index,
    selected,
    instrument,
    player_key,
    count,
    count_style,
    onSelect,
}) => {
    const handle = useRef<HTMLDivElement>(null);
    const name = instrumentName(instrument, count_style);

    return (
        <SortableItem
            handle={handle}
            index={index}
            className={merge("instrument-item", {
                "instrument-item--selected": selected,
            })}
        >
            <div ref={handle} onPointerDown={onSelect}>
                <Icon style={{ marginRight: 20 }} path={mdiDrag} size={24} />
            </div>
            <p className="instrument-item__name">
                <Text content={name} />
            </p>
            {selected && (
                <>
                    <Icon
                        aria-label="Remove Instrument"
                        size={24}
                        path={mdiDeleteOutline}
                        onClick={() => {
                            actions.score.instrument.remove(
                                player_key,
                                instrument.key
                            );
                            actions.playback.instrument.destroy(instrument.key);
                        }}
                    />
                </>
            )}
        </SortableItem>
    );
};
