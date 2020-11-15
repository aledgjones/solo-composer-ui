import { AutoCountStyle } from "./defs";
import { store } from "../use-store";
import { PlayerType } from "../score-player/defs";

export const configActions = {
  auto_count: {
    solo: (value: AutoCountStyle) =>
      store.update((s) => {
        s.score.config.auto_count[PlayerType.Solo] = value;
      }),
    section: (value: AutoCountStyle) =>
      store.update((s) => {
        s.score.config.auto_count[PlayerType.Section] = value;
      }),
  },
};
