import { Flow } from "../store/score-flow/defs";
import { Instrument } from "../store/score-instrument/defs";
import { Player } from "../store/score-player/defs";
import { Stave } from "../store/score-stave/defs";

export function getStavesAsArray(
    players: { order: string[]; by_key: { [key: string]: Player } },
    instruments: { [key: string]: Instrument },
    flow: Flow
) {
    return players.order.reduce<Stave[]>((out, player_key) => {
        if (flow.players[player_key]) {
            const player = players.by_key[player_key];
            player.instruments.forEach((instrument_key) => {
                const instrument = instruments[instrument_key];
                instrument.staves.forEach((stave_key) => {
                    out.push(flow.staves[stave_key]);
                });
            });
        }
        return out;
    }, []);
}
