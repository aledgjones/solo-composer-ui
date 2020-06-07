import { useMemo } from "react";

/**
 * Super simple pluralizer convenience method. 
 */
export function usePluralize(num: number, single: string, plural: string) {
    return useMemo(() => {
        return num === 1 ? single : plural;
    }, [num, single, plural]);
}