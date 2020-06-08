import { useState, useEffect, useMemo } from "react";
import {
    Engine,
    ThemeMode,
    InstrumentAutoCountStyle,
    View,
    PlayerType,
    NoteLength
} from "solo-composer-engine";
import * as equal from "fast-deep-equal";
import shortid from "shortid";

export { ThemeMode } from "solo-composer-engine";
export { InstrumentAutoCountStyle } from "solo-composer-engine";
export { View } from "solo-composer-engine";
export { PlayerType } from "solo-composer-engine";
export { NoteLength } from "solo-composer-engine";

export interface Patches {
    [expression: string]: string;
}

export interface Player {
    key: string;
    player_type: PlayerType;
    instruments: string[];
    name?: string;
}

export interface Entries {
    order: string[];
    by_key: { [key: string]: any }; // The typing stop here we will never actually use these js side.
}

export interface Track {
    key: string;
    entries: Entries;
}

export interface Stave {
    key: string;
    lines: number;
    mater: Track;
    tracks: string[];
}

export interface Flow {
    key: string;
    title: string;
    players: string[];
    tick_length: NoteLength;
    length: number;

    staves: { [key: string]: Stave };
    tracks: { [key: string]: Track };
}

interface State {
    app: {
        theme: ThemeMode;
        audition: boolean;
    };
    playback: {
        metronome: boolean;
    };
    score: {
        meta: {
            title: string;
            composer: string;
            created: number;
        };
        config: {
            auto_count_style: {
                solo: InstrumentAutoCountStyle;
                section: InstrumentAutoCountStyle;
            };
        };
        flows: {
            order: string[];
            by_key: {
                [key: string]: Flow;
            };
        };
        players: {
            order: string[];
            by_key: {
                [key: string]: Player;
            };
        };
    };
    ui: {
        view: View;
    };
}

const listeners: Map<string, (s: any) => void> = new Map();
export const store = new Engine((s: any) => {
    listeners.forEach((callback) => callback(s));
});

export function useStore<T>(splitter: (s: State) => T, deps: string[] = []) {
    const [state, setState] = useState<T>(splitter(store.get()));

    useEffect(() => {
        let cache = splitter(store.get());
        const key = shortid();
        const listener = (state: State) => {
            const next = splitter(state);
            if (!equal(next, cache)) {
                setState(next);
                cache = next;
            }
        };
        listeners.set(key, listener);
        return () => {
            listeners.delete(key);
        };
    }, deps);

    return state;
}

export function useActions() {
    return useMemo(() => {
        return {
            app: {
                audition: (value: boolean) => store.set_audition(value),
                theme: (value: ThemeMode) => store.set_theme(value)
            },
            playback: {
                metronome: (value: boolean) => store.set_metronome(value)
            },
            score: {
                meta: {
                    title: (value: string) => store.set_title(value),
                    composer: (value: string) => store.set_composer(value)
                },
                config: {
                    auto_count_style: {
                        solo: (value: InstrumentAutoCountStyle) =>
                            store.set_auto_count_style_solo(value),
                        section: (value: InstrumentAutoCountStyle) =>
                            store.set_auto_count_style_section(value)
                    }
                },
                flow: {
                    create: () => store.create_flow(),
                    rename: (flow_key: string, title: string) => store.rename_flow(flow_key, title),
                    reorder: (old_index: number, new_index: number) =>
                        store.reorder_flow(old_index, new_index),
                    remove: (flow_key: string) => store.remove_flow(flow_key)
                },
                player: {
                    create: (player_type: PlayerType): string => store.create_player(player_type),
                    assign_instrument: (player_key: string, instrument_key: string): string => {
                        return store.assign_instrument(player_key, instrument_key);
                    }
                },
                instrument: {
                    create: (id: string): { patches: Patches; key: string } =>
                        store.create_instrument(id)
                }
            },
            ui: {
                view: (value: View) => store.set_view(value)
            }
        };
    }, []);
}
