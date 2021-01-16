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
  timings: {
    toggle: () => {
      store.update((s) => {
        setStorage("sc:timings/v1", !s.developer.timings);
        s.developer.timings = !s.developer.timings;
      });
    },
  },
  experimental: {
    toggle: () => {
      store.update((s) => {
        setStorage("sc:experimental/v1", !s.developer.experimental);
        s.developer.experimental = !s.developer.experimental;
      });
    },
  },
};
