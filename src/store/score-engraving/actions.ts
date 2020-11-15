import { store } from "../use-store";
import { PartialEngravingConfig } from "./defs";

export const engravingActions = {
  update: (key: string, config: PartialEngravingConfig) => {
    store.update((draft, state) => {
      draft.score.engraving[key] = {
        ...state.score.engraving[key],
        ...config,
      };
    });
  },
};
