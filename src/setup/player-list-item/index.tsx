import React, { useCallback, MouseEvent, FC, useRef } from "react";
import {
  mdiChevronDown,
  mdiPlus,
  mdiDeleteOutline,
  mdiChevronUp,
} from "@mdi/js";
import { Selection, SelectionType } from "../selection";
import { SortableItem, merge, Icon, SortableContainer } from "../../../ui";
import { Text } from "../../components/text";
import { InstrumentItem } from "../instrument-item";
import { Player, PlayerType } from "../../store/score-player/defs";
import { Instrument } from "../../store/score-instrument/defs";
import { InstrumentCounts } from "../../store/score-instrument/utils";
import { useCountStyle } from "../../store/score-config/utils";
import { usePlayerName, usePlayerIcon } from "../../store/score-player/utils";
import { actions } from "../../store/actions";

import "./styles.css";

interface Props {
  index: number;
  player: Player;
  instruments: { [key: string]: Instrument };
  counts: InstrumentCounts;
  selected: boolean;
  expanded: boolean;

  onSelect: (selection: Selection) => void;
  onAddInstrument: (player_key: string, player_type: PlayerType) => void;
}

export const PlayerItem: FC<Props> = ({
  index,
  player,
  instruments,
  counts,
  selected,
  expanded,
  onSelect,
  onAddInstrument,
}) => {
  const handle = useRef<HTMLDivElement>(null);

  const onExpand = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (expanded) {
        actions.ui.setup.collapse(player.key);
      } else {
        actions.ui.setup.expand(player.key);
      }
    },
    [player.key, expanded]
  );

  const onRemove = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      actions.score.player.remove(player.key);
      onSelect(null);
    },
    [onSelect, actions.score.player, player.key]
  );

  const count_style = useCountStyle(player.type);
  const name = usePlayerName(player, instruments, counts, count_style);
  const icon = usePlayerIcon(player);

  return (
    <SortableItem
      index={index}
      handle={handle}
      className={merge("player-item", {
        "player-item--selected": selected,
      })}
      onClick={() => onSelect({ key: player.key, type: SelectionType.Player })}
    >
      <div className="player-item__header">
        <div
          onPointerDown={() =>
            onSelect({
              key: player.key,
              type: SelectionType.Player,
            })
          }
          ref={handle}
        >
          <Icon style={{ marginRight: 16 }} path={icon} size={24} />
        </div>

        <p className="player-item__name">
          <Text content={name} />
        </p>

        {selected && (
          <>
            <Icon
              style={{ marginLeft: 12 }}
              size={24}
              path={mdiDeleteOutline}
              onClick={onRemove}
            />
            {(player.instruments.length === 0 ||
              player.type === PlayerType.Solo) && (
              <Icon
                style={{ marginLeft: 12 }}
                path={mdiPlus}
                size={24}
                onClick={() => onAddInstrument(player.key, player.type)}
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
                  onSelect({
                    key: player.key,
                    type: SelectionType.Player,
                  })
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
