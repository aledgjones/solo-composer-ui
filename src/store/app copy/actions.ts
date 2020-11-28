import { store } from "../use-store";

export const appActions = {
  audition: {
    toggle: () => {
      store.update((s) => {
        localStorage.setItem("sc:audition/v1", JSON.stringify(!s.app.audition));
        s.app.audition = !s.app.audition;
      });
    },
  },
  developer: {
    console: {
      toggle: () => {
        store.update((s) => {
          localStorage.setItem("sc:console/v1", JSON.stringify(!s.app.console));
          s.developer.terminal = !s.developer.terminal;
        });
      },
    },
  },
};
