import shortid from "shortid";
import { Accidental, EntryType } from "..";
import { insert_entry } from "../../score-track/utils";
import { store } from "../../use-store";
import { ClefDrawType } from "./defs";
import { createClef } from "./utils";

export const clefActions = {
  create: (flow_key: string, tick: number, pitch: number, offset: number, drawAs: ClefDrawType): string => {
    const clef = createClef(tick, pitch, offset, drawAs);

    store.update((draft) => {
      insert_entry(draft.score.flows.by_key[flow_key].master, clef, true);
    });

    return clef.key;
  },
};
