import { FC, useState } from "react";
import { mdiPlus, mdiCogOutline } from "@mdi/js";
import { Icon, SortableContainer } from "../../../ui";
import { Selection } from "../selection";
import { PlayerItem } from "../player-list-item";
import { PlayerSettings } from "../../../dialogs/player-settings";
import { useStore } from "../../../store/use-store";
import { PlayerType } from "../../../store/score-player/defs";
import { actions } from "../../../store/actions";
import { useCounts } from "../../../store/score-instrument/hooks";
import { CollpaseDirection, Panel } from "../../../components/panel";
import { PanelHeader } from "../../../components/panel-header";

import "./styles.css";

interface Props {
  selection: Selection;

  onSelect: (selection: Selection) => void;
  onAddInstrument: (playerKey: string, player_type: PlayerType) => void;
  onCreatePlayer: () => void;
}

export const PlayerList: FC<Props> = ({ selection, onSelect, onAddInstrument, onCreatePlayer }) => {
  const [open, players, instruments, expanded] = useStore((s) => {
    return [
      s.ui.setup.panels.players,
      s.score.players.order.map((key) => s.score.players.by_key[key]),
      s.score.instruments,
      s.ui.setup.expanded,
    ];
  });
  const counts = useCounts();
  const [settings, setSettings] = useState<boolean>(false);

  return (
    <>
      <Panel
        className="player-list"
        collapse={CollpaseDirection.Right}
        collapsed={!open}
        onToggle={actions.ui.setup.panels.toggle.players}
      >
        <PanelHeader>
          <span className="player-list__label">Players</span>
          <Icon style={{ marginRight: 12 }} size={24} path={mdiCogOutline} onClick={() => setSettings(true)} />
          <Icon size={24} path={mdiPlus} onClick={onCreatePlayer} />
        </PanelHeader>
        <SortableContainer direction="y" className="player-list__content" onEnd={actions.score.player.reorder}>
          {players.map((player, i) => {
            return (
              <PlayerItem
                index={i}
                key={player.key}
                player={player}
                instruments={instruments}
                counts={counts}
                selected={selection && player.key === selection.key}
                expanded={expanded[player.key]}
                onSelect={onSelect}
                onAddInstrument={onAddInstrument}
              />
            );
          })}
        </SortableContainer>
      </Panel>

      <PlayerSettings width={900} open={settings} onClose={() => setSettings(false)} />
    </>
  );
};
