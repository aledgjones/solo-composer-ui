import { Store, useStoreState } from "pullstate";
import { State } from "./defs";
import { empty } from "./utils";

export const store = new Store<State>(empty());

export function useStore<T>(splitter: (s: State) => T, deps?: readonly any[]) {
    return useStoreState<State, T>(store, splitter, deps);
}
