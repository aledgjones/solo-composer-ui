import { useMemo } from "react";
import { useStore } from "../use-store";
import { getCounts } from "./utils";
import { instrumentDefs } from "./instrument-defs";
/**
 * Counts duplicate instrument names
 *
 * If there is more than one of the same instrument we add an auto inc count.
 * we use the length of the count array to tell if > 1 if so index + 1 = instrument number.
 *
 * eg violin ${counts['violin'].length + 1} = Violin *1*
 */
export function useCounts() {
    const [players, instruments] = useStore((s) => [s.score.players, s.score.instruments]);

    return useMemo(() => {
        return getCounts(players, instruments);
    }, [players, instruments]);
}

export function useDefsList(path: string[]): string[][] {
    return useMemo(() => {
        const seen: Set<string> = new Set();
        const tree: string[][] = [[], [], []];
        instrumentDefs.forEach((def) => {
            for (let i = 0; i < def.path.length; i++) {
                if (!seen.has(def.path[i])) {
                    tree[i].push(def.path[i]);
                    seen.add(def.path[i]);
                }
                if (def.path[i] !== path[i]) {
                    break;
                }
            }
        });
        return tree;
    }, [path]);
}
