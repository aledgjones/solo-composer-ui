import { useMemo } from "react";
import Color from "color";

/**
 * Hook: sets the alpha value of a color.
 */
export function useAlpha(color: string, alpha: number) {
    return useMemo(() => Color(color).alpha(alpha).string(), [color, alpha]);
}