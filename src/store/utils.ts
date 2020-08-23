import { State } from "./defs";
import { create_flow } from "./score-flow/utils";
import { PlayerType } from "./score-player/defs";
import { View, Tool } from "./ui/defs";
import { NoteDuration } from "./entries";
import { ThemeMode } from "./app/defs";
import { AutoCountStyle } from "./score-config/defs";
import { engravingEmptyState } from "./score-engraving/utils";

export function move(arr: any[], from: number, to: number) {
    return arr.splice(to, 0, arr.splice(from, 1)[0]);
}

export const empty = (): State => {
    const audition = localStorage.getItem("sc:audition/v1");
    const theme = localStorage.getItem("sc:theme-mode/v1");
    const flow = create_flow();
    return {
        app: {
            theme: theme === null ? ThemeMode.Dark : JSON.parse(theme),
            audition: audition === null ? true : JSON.parse(audition),
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
