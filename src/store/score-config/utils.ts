import { PlayerType } from "../score-player/defs";
import { useStore } from "../use-store";

export function useCountStyle(playerType: PlayerType) {
    return useStore((s) => s.score.config.auto_count[playerType], [playerType]);
}
