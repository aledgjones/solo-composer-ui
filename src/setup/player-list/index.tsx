import React, { FC, useState, useMemo } from "react";
import { mdiPlus, mdiCogOutline } from "@mdi/js";
import { Icon, SortableContainer } from "../../../ui";
import { Selection } from "../selection";
import { useStore, actions, PlayerType, useCounts } from "../../../store";
import { PlayerItem } from "../player-list-item";
import { SetupSettings } from "../../dialogs/setup-settings";

import "./styles.css";

interface Props {
    selection: Selection;

    onSelect: (selection: Selection) => void;
    onAddInstrument: (playerKey: string, player_type: PlayerType) => void;
    onCreatePlayer: () => void;
}

export const PlayerList: FC<Props> = ({
    selection,
    onSelect,
    onAddInstrument,
    onCreatePlayer,
}) => {
    const [players, instruments, expanded] = useStore((s) => {
        return [
            s.score.players.order.map((key) => s.score.players.by_key[key]),
            s.score.instruments,
            s.ui.setup.expanded,
        ];
    });
    const counts = useCounts();
    const [settings, setSettings] = useState<boolean>(false);

    return (
        <>
            <div className="player-list">
                <div className="player-list__header">
                    <span className="player-list__label">Players</span>
                    <Icon
                        style={{ marginRight: 12 }}
                        size={24}
                        path={mdiCogOutline}
                        onClick={() => setSettings(true)}
                    />
                    <Icon size={24} path={mdiPlus} onClick={onCreatePlayer} />
                </div>
                <SortableContainer
                    direction="y"
                    className="player-list__content"
                    onEnd={actions.score.player.reorder}
                >
                    {players.map((player, i) => {
                        return (
                            <PlayerItem
                                index={i}
                                key={player.key}
                                player={player}
                                instruments={instruments}
                                counts={counts}
                                selected={
                                    selection && player.key === selection.key
                                }
                                expanded={expanded[player.key]}
                                onSelect={onSelect}
                                onAddInstrument={onAddInstrument}
                            />
                        );
                    })}
                </SortableContainer>
            </div>

            <SetupSettings
                width={900}
                open={settings}
                onClose={() => setSettings(false)}
            />
        </>
    );
};
