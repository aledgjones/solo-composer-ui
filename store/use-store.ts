import { Engine, ThemeMode, View, NoteDuration, Tool, AutoCountStyle } from "solo-composer-engine";
import { Store, useStoreState } from "pullstate";
import { State } from "./defs";

export const store = new Store<State>({
    app: { theme: ThemeMode.Dark, audition: false },
    playback: { metronome: false },
    score: {
        meta: {
            title: "",
            subtitle: "",
            composer: "",
            arranger: "",
            lyricist: "",
            copyright: "",
            created: 0,
            modified: 0
        },
        config: {
            auto_count: { solo: AutoCountStyle.Roman, section: AutoCountStyle.Roman }
        },
        flows: { order: [], by_key: {} },
        players: {
            order: [],
            by_key: {}
        },
        instruments: {}
    },
    ui: {
        view: View.Setup,
        snap: NoteDuration.Sixteenth,
        flow_key: "",
        setup: { expanded: {} },
        play: { expanded: {}, keyboard: {}, tool: Tool.Select, zoom: 1 }
    }
});

export const engine = new Engine((s: State) => {
    store.update(() => s);
});

export function useStore<T>(splitter: (s: State) => T, deps?: readonly any[]) {
    return useStoreState<State, T>(store, splitter, deps);
}
