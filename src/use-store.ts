import { Engine, ThemeMode } from "solo-composer-parser";
import * as equal from "fast-deep-equal";
import { useState, useEffect, useMemo, useRef } from "react";
import shortid from "shortid";

export interface Shade {
    background: string;
    foreground: string;
}

export interface Pallet {
    shade_200: Shade;
    shade_300: Shade;
    shade_400: Shade;
    shade_500: Shade;
    shade_600: Shade;
    shade_700: Shade;
    shade_800: Shade;
}

interface State {
    meta: {
        title: string;
        composer: string;
        created: number;
    };
    app: {
        theme: {
            mode: ThemeMode;

            pallets: {
                background: Pallet;
                primary: Pallet;
                highlight: Pallet;
                error: Pallet;
            };
        };
        audition: boolean;
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
            score: {
                meta: {
                    title: (value: string) => store.set_title(value),
                    composer: (value: string) => store.set_composer(value)
                }
            }
        };
    }, []);
}
