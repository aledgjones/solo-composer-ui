import { unpack } from "jsonpack";
import { Progress, Player } from "solo-composer-scheduler";
import { store } from "../use-store";
import { download, chooseFiles, wait } from "../../../ui";
import { Score, Meta } from "./defs";
import { playbackActions } from "../playback";
import { View } from "../ui/defs";

export const scoreActions = {
  /**
   * Export the current score
   */
  export: () => {
    const state = store.getRawState();
    const filename = state.score.meta.title
      ? state.score.meta.title.toLocaleLowerCase().replace(/\s/g, "-") + ".scf"
      : "untitled.scf";
    download(state.score, filename);
  },
  /**
   * Import a score
   */
  import: async (progress: Progress) => {
    const resp = await chooseFiles();
    const file = resp.files[0];
    if (file) {
      // go to setup to avoid failures
      store.update((s) => {
        s.ui.view = View.Setup;
      });
      await wait(500);
      progress(1, 5);

      // stop playback and return to start
      playbackActions.transport.stop();
      playbackActions.transport.to_start();
      playbackActions.sampler.destroyAll();
      progress(2, 5);

      // import the json file
      const content = await file.text();
      const score: Score = unpack(content);
      progress(3, 5);

      //  playback
      await Promise.all(
        score.players.order.map(async (player_key) => {
          const player = score.players.by_key[player_key];
          return Promise.all(
            player.instruments.map(async (instrument_key) => {
              const instrument = score.instruments[instrument_key];
              await playbackActions.sampler.load(
                instrument.id,
                instrument.key,
                player.type
              );
              Player.volume(instrument_key, instrument.volume / 100);
              if (instrument.mute) {
                Player.mute(instrument_key);
              }
              if (instrument.solo) {
                Player.solo(instrument_key);
              }
            })
          );
        })
      );
      progress(4, 5);

      // set the imported state in the engine
      store.update((s) => {
        return {
          ...s,
          score,
          ui: {
            ...s.ui,
            flow_key: score.flows.order[0],
          },
        };
      });
      progress(5, 5);

      const flowKey = score.flows.order[0];
      const flow = score.flows.by_key[flowKey];

      console.log(flowKey, flow.subdivisions);
    }
  },
  meta: {
    update: (value: Partial<Meta>) => {
      store.update((draft, state) => {
        draft.score.meta = { ...state.score.meta, ...value };
      });
    },
  },
};
