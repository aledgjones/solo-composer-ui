import { Engine, NoteDuration, AutoCountStyle } from "solo-composer-engine";
import { Store, useStoreState } from "pullstate";
import { State, ThemeMode, View, Tool, Score } from "./defs";
import localforage from "localforage";

export const store = new Store<State>({
    app: {
        theme: ThemeMode.Dark,
        audition: false,
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
            created: 0,
            modified: 0,
        },
        config: {
            auto_count: {
                solo: AutoCountStyle.Roman,
                section: AutoCountStyle.Roman,
            },
        },
        flows: { order: [], by_key: {} },
        players: {
            order: [],
            by_key: {},
        },
        instruments: {},
    },
    ui: {
        view: View.Setup,
        snap: NoteDuration.Sixteenth,
        flow_key: "",
        setup: { expanded: {} },
        play: {
            selected: {},
            expanded: {},
            keyboard: {},
            tool: Tool.Select,
            zoom: 1,
        },
    },
});

(async () => {
    const audition = await localforage.getItem<boolean>("sc:audition/v1");
    const theme = await localforage.getItem<ThemeMode>("sc:theme-mode/v1");
    store.update((s) => {
        s.app.audition = audition === null ? true : audition;
        s.app.theme = theme === null ? ThemeMode.Dark : theme;
    });
})();

export const engine = new Engine((score: Score) => {
    store.update((state) => {
        return {
            ...state,
            score,
        };
    });
});

export function useStore<T>(splitter: (s: State) => T, deps?: readonly any[]) {
    return useStoreState<State, T>(store, splitter, deps);
}
