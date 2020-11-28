import { store } from "../use-store";
import { setStorage } from "../utils";

export const developerActions = {
  debug: {
    toggle: () => {
      store.update((s) => {
        setStorage("sc:debug/v1", !s.developer.debug);
        s.developer.debug = !s.developer.debug;
      });
    },
  },
  terminal: {
    toggle: () => {
      store.update((s) => {
        setStorage("sc:terminal/v1", !s.developer.terminal.show);
        s.developer.terminal.show = !s.developer.terminal.show;
      });
    },
  },
};
