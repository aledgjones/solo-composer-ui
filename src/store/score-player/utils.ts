import shortid from "shortid";
import { PlayerType, Player } from "./defs";
import { Instrument } from "../score-instrument/defs";
import { instrumentName, InstrumentCounts } from "../score-instrument/utils";
import { AutoCountStyle } from "../score-config/defs";
import { useMemo } from "react";
import { mdiAccount, mdiAccountGroup } from "@mdi/js";

export function create_player(player_type: PlayerType): Player {
  return {
    key: shortid(),
    type: player_type,
    instruments: [],
  };
}

export function usePlayerName(
  player: Player,
  instruments: { [key: string]: Instrument },
  counts: InstrumentCounts,
  count_style: AutoCountStyle
) {
  return useMemo(() => {
    if (player.instruments.length === 0) {
      switch (player.type) {
        case PlayerType.Solo:
          return "Empty-handed Player";
        default:
          return "Empty-handed Section";
      }
    } else {
      const len = player.instruments.length;
      return player.instruments.reduce((output, key, i) => {
        const isFirst = i === 0;
        const isLast = i === len - 1;
        const name = instrumentName(instruments[key], count_style, counts[key]);
        if (isFirst) {
          return name;
        } else if (isLast) {
          return output + " & " + name;
        } else {
          return output + ", " + name;
        }
      }, "");
    }
  }, [player, instruments, counts, count_style]);
}

export function usePlayerIcon(player: Player) {
  switch (player.type) {
    case PlayerType.Solo:
      return mdiAccount;
    default:
      return mdiAccountGroup;
  }
}
