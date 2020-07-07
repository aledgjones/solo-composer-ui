import { Engine, ThemeMode, View, NoteDuration, Tool, AutoCountStyle } from "solo-composer-engine";
import { State } from "./defs";
import { Store, useStoreState } from "pullstate";

const store = new Store<State>({
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
        setup: { expanded: {} },
        play: { expanded: {}, keyboard: {}, tool: Tool.Select, zoom: 1 }
    }
});

export const engine = new Engine((s: any) => {
    store.update(() => s);
});

export function useStore<T>(splitter: (s: State) => T, deps?: readonly any[]) {
    return useStoreState(store, splitter, deps);
}
