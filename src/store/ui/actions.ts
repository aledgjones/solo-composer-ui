import { store } from "../use-store";
import { View, Tool } from "./defs";
import { NoteDuration } from "../entries";
import { Transport } from "solo-composer-scheduler";

export const uiActions = {
  view: (view: View) => {
    store.update((s) => {
      s.ui.view = view;
    });
  },
  snap: (snap: NoteDuration) => {
    store.update((s) => {
      s.ui.snap = snap;
    });
  },
  flow_key: (key: string) => {
    store.update((s) => {
      Transport.seek(0);
      s.ui.flow_key = key;
    });
  },
  setup: {
    expand: (key: string) => {
      store.update((s) => {
        s.ui.setup.expanded[key] = true;
      });
    },
    collapse: (key: string) => {
      store.update((s) => {
        delete s.ui.setup.expanded[key];
      });
    },
    panels: {
      toggle: {
        players: () => {
          store.update((s) => {
            s.ui.setup.panels.players = !s.ui.setup.panels.players;
          });
        },
        layouts: () => {
          store.update((s) => {
            s.ui.setup.panels.layouts = !s.ui.setup.panels.layouts;
          });
        },
      },
    },
  },
  write: {
    panels: {
      toggle: {
        elements: () => {
          store.update((s) => {
            s.ui.write.panels.elements = !s.ui.write.panels.elements;
          });
        },
      },
    },
  },
  play: {
    selection: {
      select: (key: string) => {
        store.update((s) => {
          s.ui.play.selected[key] = true;
        });
      },
      deselect: (key: string) => {
        store.update((s) => {
          delete s.ui.play.selected[key];
        });
      },
      clear: () => {
        store.update((s) => {
          s.ui.play.selected = {};
        });
      },
    },
    expand: (key: string) => {
      store.update((s) => {
        s.ui.play.expanded[key] = true;
      });
    },
    collapse: (key: string) => {
      store.update((s) => {
        delete s.ui.play.expanded[key];
      });
    },
    keyboard: (instrument_key: string, base: number) => {
      store.update((s) => {
        s.ui.play.keyboard[instrument_key] = base;
      });
    },
    tool: (tool: Tool) => {
      store.update((s) => {
        s.ui.play.tool = tool;
      });
    },
    zoom: (zoom: number) => {
      store.update((s) => {
        s.ui.play.zoom = parseFloat(zoom.toFixed(2));
      });
    },
  },
};
