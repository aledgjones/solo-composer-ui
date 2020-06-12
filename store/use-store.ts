import { useState, useEffect } from "react";
import { Engine } from "solo-composer-engine";
import * as equal from "fast-deep-equal";
import shortid from "shortid";
import { State } from "./defs";

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
