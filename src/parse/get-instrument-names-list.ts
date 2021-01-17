import { instrumentName, InstrumentCounts } from "../store/score-instrument/utils";
import { Instrument } from "../store/score-instrument/defs";
import { Player, PlayerType } from "../store/score-player/defs";
import { Flow } from "../store/score-flow/defs";
import { AutoCountStyle } from "../store/score-config/defs";

export function getInstrumentNamesList(
  players: { order: string[]; by_key: { [key: string]: Player } },
  instruments: { [key: string]: Instrument },
  counts: InstrumentCounts,
  count_styles: { [type in PlayerType]: AutoCountStyle },
  flow: Flow
) {
  const out: { [key: string]: string } = {};
  players.order.forEach((player_key) => {
    if (flow.players[player_key]) {
      const player = players.by_key[player_key];
      player.instruments.forEach((instrument_key) => {
        const instrument = instruments[instrument_key];
        out[instrument_key] = instrumentName(instrument, count_styles[player.type], counts[instrument_key]);
      });
    }
  });
  return out;
}
