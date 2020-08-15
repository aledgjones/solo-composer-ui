import { Store, useStoreState } from "pullstate";
import {
    State,
    ThemeMode,
    View,
    Tool,
    AutoCountStyle,
    NoteDuration,
} from "./defs";
import { create_flow } from "./flow";

export const empty = (): State => {
    const audition = localStorage.getItem("sc:audition/v1");
    const theme = localStorage.getItem("sc:theme-mode/v1");
    const flow = create_flow();
    return {
        app: {
            theme: theme === undefined ? ThemeMode.Dark : JSON.parse(theme),
            audition: audition === undefined ? true : JSON.parse(audition),
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
                    solo: AutoCountStyle.Roman,
                    section: AutoCountStyle.Roman,
                },
            },
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
            setup: { expanded: {} },
            play: {
                selected: {},
                expanded: {},
                keyboard: {},
                tool: Tool.Select,
                zoom: 1,
            },
        },
    };
};

export const store = new Store<State>(empty());

export function useStore<T>(splitter: (s: State) => T, deps?: readonly any[]) {
    return useStoreState<State, T>(store, splitter, deps);
}
