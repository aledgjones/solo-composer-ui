import { Instrument } from "../store/score-instrument/defs";
import { EngravingConfig } from "../store/defs";
import { Flow } from "../store/score-flow/defs";
import { Player } from "../store/score-player/defs";

export interface VerticalSpacing {
    height: number;
    instruments: {
        [instrumentKey: string]: {
            y: number;
            height: number;
        };
    };
    staves: {
        [staveKey: string]: {
            y: number;
            height: number;
        };
    };
}

export function measureVerticalSpacing(
    players: { order: string[]; by_key: { [key: string]: Player } },
    instruments: { [key: string]: Instrument },
    config: EngravingConfig,
    flow: Flow
) {
    const output: VerticalSpacing = {
        instruments: {},
        staves: {},
        height: 0.0,
    };

    const player_count = Object.keys(flow.players).length;

    let player_i = 0;
    players.order.forEach((player_key) => {
        if (flow.players[player_key]) {
            const player = players.by_key[player_key];
            const is_last_player = player_i === player_count - 1;
            player_i++;

            player.instruments.forEach((instrument_key, instrument_i) => {
                const instrument = instruments[instrument_key];
                const is_last_instrument =
                    instrument_i === player.instruments.length - 1;
                const instrument_entry = { y: output.height, height: 0.0 };

                instrument.staves.forEach((stave_key, stave_i) => {
                    const stave = flow.staves[stave_key];
                    const is_last_stave =
                        stave_i === instrument.staves.length - 1;
                    const stave_entry = {
                        y: output.height,
                        height: stave.lines.length - 1,
                    };

                    output.height += stave_entry.height;
                    instrument_entry.height += stave_entry.height;

                    if (is_last_stave) {
                        if (is_last_player && is_last_instrument) {
                            // do nothing
                        } else {
                            output.height += config.instrumentSpacing;
                        }
                    } else {
                        output.height += config.staveSpacing;
                        instrument_entry.height += config.staveSpacing;
                    }

                    output.staves[stave_key] = stave_entry;
                });

                output.instruments[instrument_key] = instrument_entry;
            });
        }
    });

    return output;
}
