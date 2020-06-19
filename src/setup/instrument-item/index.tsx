import React, { FC, useMemo, useRef } from "react";
import { mdiPiano, mdiDeleteOutline, mdiDrag } from "@mdi/js";
import { SortableItem, Icon, merge } from "../../../ui";
import { Text } from "../../components/text";
import { Instrument, InstrumentAutoCountStyle, useInstrumentName, actions } from "../../../store";

import "./styles.css";

interface Props {
    index: number;
    selected: boolean;
    instrument: Instrument;
    player_key: string;
    count?: number;
    count_style: InstrumentAutoCountStyle;

    onSelect: () => void;
}

export const InstrumentItem: FC<Props> = ({
    index,
    selected,
    instrument,
    player_key,
    count,
    count_style,
    onSelect
}) => {
    const handle = useRef<HTMLDivElement>(null);
    const name = useInstrumentName(count_style, instrument, count);

    return (
        <SortableItem
            handle={handle}
            index={index}
            className={merge("instrument-item", { "instrument-item--selected": selected })}
        >
            <div ref={handle} onPointerDown={onSelect}>
                <Icon style={{ marginRight: 20, color: "var(--background-200)" }} path={mdiDrag} size={24} />
            </div>
            <p className="instrument-item__name">
                <Text>{name}</Text>
            </p>
            {selected && (
                <>
                    <Icon
                        aria-label="Remove Instrument"
                        size={24}
                        path={mdiDeleteOutline}
                        onClick={() => actions.score.instrument.remove(player_key, instrument.key)}
                    />
                </>
            )}
        </SortableItem>
    );
};
