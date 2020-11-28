import { store } from "../../use-store";
import { insert_entry } from "../../score-track/utils";
import { createKeySignature } from "./utils";
import { KeySignatureMode } from "./defs";

export const keySignatureActions = {
  create: (
    flow_key: string,
    tick: number,
    mode: KeySignatureMode,
    offset: number
  ): string => {
    const keySignature = createKeySignature(tick, mode, offset);

    store.update((draft) => {
      insert_entry(
        draft.score.flows.by_key[flow_key].master,
        keySignature,
        true
      );
    });

    return keySignature.key;
  },
};
