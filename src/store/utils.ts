import { State } from "./defs";
import { create_flow } from "./score-flow/utils";
import { PlayerType } from "./score-player/defs";
import { View, Tool } from "./ui/defs";
import { NoteDuration } from "./entries/defs";
import { AutoCountStyle } from "./score-config/defs";
import { engravingEmptyState } from "./score-engraving/utils";

export function getStorage(key: string) {
  const result = localStorage.getItem(key);
  if (result) {
    return JSON.parse(result);
  } else {
    return undefined;
  }
}

export function setStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function move(arr: any[], from: number, to: number) {
  return arr.splice(to, 0, arr.splice(from, 1)[0]);
}

export const empty = (): State => {
  const flow = create_flow();
  return {
    app: {
      audition: getStorage("sc:audition/v1") || true,
    },
    playback: {
      metronome: false,
      transport: { playing: false },
      instruments: {},
    },
    score: {
      meta: {
        title: "",
        subtitle: "",
        composer: "",
        arranger: "",
        lyricist: "",
        copyright: "",
        created: Date.now(),
        modified: Date.now(),
      },
      config: {
        auto_count: {
          [PlayerType.Solo]: AutoCountStyle.Roman,
          [PlayerType.Section]: AutoCountStyle.Roman,
        },
      },
      engraving: engravingEmptyState(),
      flows: { order: [flow.key], by_key: { [flow.key]: flow } },
      players: {
        order: [],
        by_key: {},
      },
      instruments: {},
    },
    ui: {
      view: View.Setup,
      snap: NoteDuration.Sixteenth,
      flow_key: flow.key,
      selection: {},
      setup: {
        expanded: {},
        panels: {
          players: true,
          layouts: true,
        },
      },
      write: {
        panels: {
          elements: true,
        },
        popover: null,
        tick: 0,
      },
      play: {
        stave: {},
        expanded: {},
        keyboard: {},
        tool: Tool.Select,
        zoom: 1,
      },
    },
    developer: {
      debug: getStorage("sc:debug/v1") || false,
      experimental: getStorage("sc:experimental/v1") || false,
    },
  };
};
