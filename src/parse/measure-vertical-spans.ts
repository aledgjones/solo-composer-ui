import { Instrument } from "../store/score-instrument/defs";
import { Player } from "../store/score-player/defs";
import { EngravingConfig } from "../store/defs";
import { Flow } from "../store/score-flow/defs";
import { getInstrumentFamily } from "./get-instrument-family";
import { getIsSpan, BracketSpan } from "./get-is-span";

export interface VerticalSpans {
  brackets: Array<{ start: string; stop: string }>;
  subBrackets: Array<{ start: string; stop: string }>;
  braces: Array<{ start: string; stop: string }>;
  barlines: Array<{ start: string; stop: string }>;
}

export function measureVerticalSpans(
  players: { order: string[]; by_key: { [key: string]: Player } },
  instruments: { [key: string]: Instrument },
  config: EngravingConfig,
  flow: Flow
): VerticalSpans {
  let previous_instrument: Instrument;

  return players.order.reduce<VerticalSpans>(
    (output, player_key) => {
      if (flow.players[player_key]) {
        const player = players.by_key[player_key];
        player.instruments.forEach((instrument_key) => {
          const instrument = instruments[instrument_key];
          const is_span = getIsSpan(instrument, previous_instrument, config.bracketing);

          // BRACKETS

          switch (is_span) {
            case BracketSpan.Start:
              output.brackets.push({
                start: instrument.key,
                stop: instrument.key,
              });
              break;
            case BracketSpan.Continue:
              output.brackets[output.brackets.length - 1].stop = instrument.key;
              break;
            default:
              break;
          }

          // SUBBRACKETS

          if (
            config.subBracket &&
            previous_instrument &&
            (is_span === BracketSpan.Start || is_span === BracketSpan.Continue) &&
            instrument.id === previous_instrument.id
          ) {
            const subBracketEntry = output.subBrackets[output.subBrackets.length - 1];
            if (subBracketEntry && subBracketEntry.stop === previous_instrument.key) {
              subBracketEntry.stop = instrument.key;
            } else {
              output.subBrackets.push({
                start: previous_instrument.key,
                stop: instrument.key,
              });
            }
          }

          // BRACES

          if (instrument.staves.length > 1) {
            output.braces.push({
              start: instrument.staves[0],
              stop: instrument.staves[instrument.staves.length - 1],
            });
          }

          // BARLINES

          switch (is_span) {
            case BracketSpan.Start:
              output.barlines.push({
                start: instrument.key,
                stop: instrument.key,
              });
              break;
            case BracketSpan.Continue:
              output.barlines[output.barlines.length - 1].stop = instrument.key;
              break;
            default:
              output.barlines.push({
                start: instrument.key,
                stop: instrument.key,
              });
              break;
          }

          previous_instrument = instrument;
        });
      }
      return output;
    },
    { brackets: [], subBrackets: [], braces: [], barlines: [] }
  );
}
