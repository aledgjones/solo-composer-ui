import { PlayerType, Player } from "./defs";
import shortid from "shortid";

export function create_player(player_type: PlayerType): Player {
    return {
        key: shortid(),
        type: player_type,
        instruments: [],
    };
}
