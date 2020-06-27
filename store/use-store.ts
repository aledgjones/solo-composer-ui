import { useState, useEffect, useRef } from "react";
import { Engine } from "solo-composer-engine";
import * as equal from "fast-deep-equal";
import shortid from "shortid";
import { State } from "./defs";

const listeners: Map<string, (s: any) => void> = new Map();
export const store = new Engine((s: any) => {
    listeners.forEach((callback) => callback(s));
});

export function useStore<T>(splitter: (s: State) => T, deps: any[] = []) {
    const cache = useRef(splitter(store.get()));
    const [state, setState] = useState<T>(() => splitter(store.get()));

    useEffect(() => {
        // when the deps update we recalculate
        const next = splitter(store.get());
        if (!equal(next, cache.current)) {
            setState(next);
            cache.current = next;
        }

        // then assign a new listener
        const key = shortid();
        const listener = (state: State) => {
            const next = splitter(state);
            if (!equal(next, cache.current)) {
                setState(next);
                cache.current = next;
            }
        };
        listeners.set(key, listener);
        return () => {
            listeners.delete(key);
        };
    }, [cache, ...deps]);

    return state;
}
