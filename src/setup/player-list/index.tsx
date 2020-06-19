import React, { FC, useState } from "react";
import { mdiPlus, mdiCogOutline } from "@mdi/js";
import { Icon, SortableContainer } from "../../../ui";
import { Selection } from "../selection";
import { useStore, actions, useCounts, PlayerType } from "../../../store";
import { PlayerItem } from "../player-list-item";
import { SetupSettings } from "../../dialogs/setup-settings";

import "./styles.css";

interface Props {
    selection: Selection;

    onSelect: (selection: Selection) => void;
    onAddInstrument: (playerKey: string) => void;
    onCreatePlayer: () => void;
}

export const PlayerList: FC<Props> = ({ selection, onSelect, onAddInstrument, onCreatePlayer }) => {
    const { players, instruments, expanded, count_config } = useStore((s) => {
        return {
            players: s.score.players.order.map((key) => {
                return s.score.players.by_key[key];
            }),
            instruments: s.score.instruments,
            expanded: s.ui.expanded,
            count_config: s.score.config.auto_count
        };
    });

    const counts = useCounts(players, instruments);
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
                <SortableContainer direction="y" className="player-list__content" onEnd={actions.score.player.reorder}>
                    {players.map((player, i) => (
                        <PlayerItem
                            index={i}
                            key={player.key}
                            player={player}
                            instruments={instruments}
                            counts={counts}
                            count_style={
                                player.player_type === PlayerType.Solo
                                    ? count_config.solo.style
                                    : count_config.section.style
                            }
                            selected={selection && player.key === selection.key}
                            expanded={expanded[player.key + "-setup"]}
                            onSelect={onSelect}
                            onAddInstrument={onAddInstrument}
                        />
                    ))}
                </SortableContainer>
            </div>

            <SetupSettings width={900} open={settings} onClose={() => setSettings(false)} />
        </>
    );
};
