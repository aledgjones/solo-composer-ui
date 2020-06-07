import { useMemo } from "react";
import Color from "color";

/**
 * Hook: returns white on dark colors, black on light;
 */
export function useForeground(color: string) {
    return useMemo(() => Color(color).isDark() ? '#ffffff' : '#000000', [color]);
}