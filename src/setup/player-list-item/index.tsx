import React, { useCallback, useMemo, MouseEvent, FC, useRef } from "react";
import { mdiChevronDown, mdiPlus, mdiDeleteOutline, mdiChevronUp } from "@mdi/js";

import "./styles.css";
import {
    Player,
    Instrument,
    actions,
    PlayerType,
    usePlayerName,
    usePlayerIcon,
    InstrumentAutoCountStyle
} from "../../../store";
import { Selection, SelectionType } from "../selection";
import { SortableItem, merge, Icon, SortableContainer } from "../../ui";
import { Text } from "../../components/text";
import { InstrumentItem } from "../instrument-item";

interface Props {
    index: number;
    player: Player;
    instruments: { [key: string]: Instrument };
    counts: { [key: string]: number };
    count_style: InstrumentAutoCountStyle;
    selected: boolean;
    expanded: boolean;

    onSelect: (selection: Selection) => void;
    onAddInstrument: (player_key: string) => void;
}

export const PlayerItem: FC<Props> = ({
    index,
    player,
    instruments,
    counts,
    count_style,
    selected,
    expanded,
    onSelect,
    onAddInstrument
}) => {
    const handle = useRef<HTMLDivElement>(null);

    const onExpand = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (expanded) {
                actions.ui.collapse(player.key + "-setup");
            } else {
                actions.ui.expand(player.key + "-setup");
            }
        },
        [actions.ui.expand, player.key, expanded]
    );

    const onRemove = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            // actions.score.player.remove(player.key); <==== TO DO
            onSelect(null);
        },
        [onSelect, actions.score.player, player.key]
    );

    const name = usePlayerName(player, instruments, counts, count_style);
    const icon = usePlayerIcon(player);

    return (
        <SortableItem
            index={index}
            handle={handle}
            className={merge("player-item", { "player-item--selected": selected })}
            onClick={() => onSelect({ key: player.key, type: SelectionType.Player })}
        >
            <div className="player-item__header">
                <div
                    onPointerDown={() => onSelect({ key: player.key, type: SelectionType.Player })}
                    ref={handle}
                >
                    <Icon style={{ marginRight: 16 }} path={icon} size={24} />
                </div>

                <Text style={{ whiteSpace: "pre" }} className="player-item__name">
                    {name}
                </Text>

                {selected && (
                    <>
                        <Icon
                            style={{ marginLeft: 12 }}
                            size={24}
                            path={mdiDeleteOutline}
                            onClick={onRemove}
                        />
                        {(player.instruments.length === 0 ||
                            player.player_type === PlayerType.Solo) && (
                            <Icon
                                style={{ marginLeft: 12 }}
                                path={mdiPlus}
                                size={24}
                                onClick={() => onAddInstrument(player.key)}
                            />
                        )}
                    </>
                )}
                <Icon
                    style={{ marginLeft: 12 }}
                    path={expanded ? mdiChevronUp : mdiChevronDown}
                    size={24}
                    onClick={onExpand}
                />
            </div>
            {expanded && (
                <SortableContainer
                    direction="y"
                    className="player-item__list"
                    onEnd={(oldIndex: number, newIndex: number) =>
                        actions.score.instrument.reorder(player.key, oldIndex, newIndex)
                    }
                >
                    {player.instruments.map((key, i) => {
                        return (
                            <InstrumentItem
                                key={key}
                                index={i}
                                onSelect={() =>
                                    onSelect({ key: player.key, type: SelectionType.Player })
                                }
                                selected={selected}
                                instrument={instruments[key]}
                                player_key={player.key}
                                count={counts[key]}
                                count_style={count_style}
                            />
                        );
                    })}
                </SortableContainer>
            )}
        </SortableItem>
    );
};
