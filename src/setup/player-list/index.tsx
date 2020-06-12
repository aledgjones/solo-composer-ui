import React, { FC } from "react";
import { mdiPlus } from "@mdi/js";
import { Icon, SortableContainer } from "../../ui";
import { Selection } from "../selection";
import { useStore, actions, useCounts } from "../../../store";
import { PlayerItem } from "../player-list-item";

import "./styles.css";

interface Props {
    selection: Selection;

    onSelect: (selection: Selection) => void;
    onAddInstrument: (playerKey: string) => void;
    onCreatePlayer: () => void;
}

export const PlayerList: FC<Props> = ({ selection, onSelect, onAddInstrument, onCreatePlayer }) => {
    const { players, instruments, expanded, count_styles } = useStore((s) => {
        return {
            players: s.score.players.order.map((key) => {
                return s.score.players.by_key[key];
            }),
            instruments: s.score.instruments,
            expanded: s.ui.expanded,
            count_styles: s.score.config.auto_count_style
        };
    });

    const counts = useCounts(players, instruments);

    return (
        <div className="player-list">
            <div className="player-list__header">
                <span className="player-list__label">Players</span>
                <Icon size={24} path={mdiPlus} onClick={onCreatePlayer} />
            </div>
            <SortableContainer
                direction="y"
                className="player-list__content"
                onEnd={actions.score.player.reorder}
            >
                {players.map((player, i) => (
                    <PlayerItem
                        index={i}
                        key={player.key}
                        player={player}
                        instruments={instruments}
                        counts={counts}
                        count_styles={count_styles}
                        selected={selection && player.key === selection.key}
                        expanded={expanded[player.key + "-setup"]}
                        onSelect={onSelect}
                        onAddInstrument={onAddInstrument}
                    />
                ))}
            </SortableContainer>
        </div>
    );
};
