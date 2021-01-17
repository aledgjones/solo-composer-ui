import { Instrument } from "../store/score-instrument/defs";
import { EngravingConfig } from "../store/defs";
import { Flow } from "../store/score-flow/defs";
import { Player } from "../store/score-player/defs";
import { Stave } from "../store/score-stave/defs";

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

  let isFirstPlayerInScore = true;
  players.order.forEach((playerKey) => {
    if (flow.players[playerKey]) {
      const player = players.by_key[playerKey];

      player.instruments.forEach((instrumentKey, instrument_i) => {
        const instrument = instruments[instrumentKey];
        const isFirstInstrumentInScore = isFirstPlayerInScore && instrument_i === 0;

        if (instrument.staves.length > 0 && !isFirstInstrumentInScore) {
          output.height += config.instrumentSpacing;
        }

        const instrumentEntry = { y: output.height, height: 0.0 };

        instrument.staves.forEach((stave_key, stave_i) => {
          const stave = flow.staves[stave_key];
          const isFirstStaveInInstrument = stave_i === 0;
          const isFirstStaveInScore = isFirstInstrumentInScore && stave_i === 0;

          if (!isFirstStaveInScore && !isFirstStaveInInstrument) {
            output.height += config.staveSpacing;
            instrumentEntry.height += config.staveSpacing;
          }

          const staveEntry = {
            y: output.height + (stave.lines.length - 1) / 2,
            height: stave.lines.length - 1,
          };

          output.height += staveEntry.height;
          instrumentEntry.height += staveEntry.height;

          output.staves[stave_key] = staveEntry;
        });

        output.instruments[instrumentKey] = instrumentEntry;

        if (instrument.staves.length > 0) {
          isFirstPlayerInScore = false;
        }
      });
    }
  });

  return output;
}
