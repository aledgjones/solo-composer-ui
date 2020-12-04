import { store } from "../../use-store";
import { insert_entry } from "../../score-track/utils";
import { createBarline } from "./utils";
import { BarlineDrawType } from "./defs";

export const barlineActions = {
  create: (flow_key: string, tick: number, barlineDrawType: BarlineDrawType): string => {
    const barline = createBarline(tick, barlineDrawType);

    store.update((draft) => {
      insert_entry(draft.score.flows.by_key[flow_key].master, barline, true);
    });

    return barline.key;
  },
};
