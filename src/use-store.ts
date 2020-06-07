import { useState, useEffect, useMemo } from "react";
import { Engine, ThemeMode, InstrumentAutoCountStyle, View, PlayerType, NoteLength } from "solo-composer-parser";
import * as equal from "fast-deep-equal";
import shortid from "shortid";

interface Patches {
    [expression: string]: string;
}

interface Player {
    key: string;
    player_type: PlayerType;
    instruments: string[];
    name?: string;
}

interface Flow {
    key: string;
    title: string;
    players: string[];
    tick_length: NoteLength;
    length: number;
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
                        solo: (value: InstrumentAutoCountStyle) => store.set_auto_count_style_solo(value),
                        section: (value: InstrumentAutoCountStyle) => store.set_auto_count_style_section(value)
                    }
                },
                player: {
                    create: (player_type: PlayerType): string => store.create_player(player_type),
                    assign_instrument: (player_key: string, instrument_key: string): string => {
                        return store.assign_instrument(player_key, instrument_key);
                    }
                },
                instrument: {
                    create: (id: string): { patches: Patches; key: string } => store.create_instrument(id)
                }
            },
            ui: {
                view: (value: View) => store.set_view(value)
            }
        };
    }, []);
}
