import { Transport, Player } from "solo-composer-scheduler";
import { store } from "../use-store";
import { Status } from "./defs";
import { PlayerType } from "../score-player/defs";
import { get_patches } from "../score-instrument/utils";
import { Expression } from "../score-instrument/defs";

export const playbackActions = {
  metronome: {
    toggle: () => {
      store.update((s) => {
        s.playback.metronome = !s.playback.metronome;
      });
    },
  },
  transport: {
    play: () => {
      Transport.start();
    },
    stop: () => {
      Transport.pause();
      Player.stopAll();
    },
    to_start: () => {
      Player.stopAll();
      Transport.seek(0);
    },
  },
  sampler: {
    load: async (
      id: string,
      instrumentKey: string,
      player_type: PlayerType
    ) => {
      // kick things off ready for loading in the sampler
      store.update((s) => {
        s.playback.instruments[instrumentKey] = {
          key: instrumentKey,
          id,
          status: Status.Pending,
          progress: 0,
          expressions: {},
        };
      });

      const instrument = Player.createSampler(instrumentKey);

      const map = get_patches(id, player_type);
      let expressions = Object.entries(map);

      await Promise.all(
        expressions.map(async ([exp, url]) => {
          const expression = parseInt(exp);
          store.update((s) => {
            s.playback.instruments[instrumentKey].expressions[expression] = {
              key: expression,
              status: Status.Pending,
              progress: 0,
            };
          });
          await instrument.load(parseInt(exp), url, (total, progress) => {
            store.update((s) => {
              s.playback.instruments[instrumentKey].expressions[
                expression
              ].progress = progress / total;
            });
          });
          store.update((s) => {
            s.playback.instruments[instrumentKey].expressions[
              expression
            ].status = Status.Ready;
          });
        })
      );

      // all expressions for this instrument are loaded so set instrument to ready.
      store.update((s) => {
        s.playback.instruments[instrumentKey].status = Status.Ready;
      });
    },
    audition: (instrument_key: string, pitch: number) => {
      Player.play(
        instrument_key,
        Expression.Natural,
        pitch,
        Player.ctx.currentTime,
        0.5
      );
    },
    destroy: (instrument_key: string) => {
      store.update((s) => {
        delete s.playback.instruments[instrument_key];
        Player.disconnect(instrument_key);
      });
    },
    destroyAll: () => {
      store.update((s) => {
        Object.keys(s.playback.instruments).forEach((key) => {
          delete s.playback.instruments[key];
          Player.disconnect(key);
        });
      });
    },
  },
};
