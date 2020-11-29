import { create_flow } from "./utils";
import { Flow } from "./defs";
import { store } from "../use-store";
import { move } from "../utils";
import { get_def } from "../score-instrument/utils";
import { create_stave } from "../score-stave/utils";

export const flowActions = {
  create: (): string => {
    const flow: Flow = create_flow();
    store.update((s) => {
      s.score.flows.order.push(flow.key);
      s.score.flows.by_key[flow.key] = flow;
    });
    return flow.key;
  },
  rename: (flow_key: string, title: string) =>
    store.update((s) => {
      s.score.flows.by_key[flow_key].title = title;
    }),
  length: (flow_key: string, length: number) =>
    store.update((s) => {
      s.score.flows.by_key[flow_key].length = length;
    }),
  reorder: (old_index: number, new_index: number) =>
    store.update((draft) => {
      move(draft.score.flows.order, old_index, new_index);
    }),
  assign_player: (flow_key: string, player_key: string) =>
    store.update((draft, state) => {
      const flow = draft.score.flows.by_key[flow_key];
      flow.players[player_key] = true;

      const player = state.score.players.by_key[player_key];
      player.instruments.forEach((instrumentKey) => {
        const instrument = state.score.instruments[instrumentKey];
        const instrumentDef = get_def(instrument.id);
        instrument.staves.forEach((staveKey, i) => {
          const staveDef = instrumentDef.staves[i];
          const stave = create_stave(staveKey, staveDef);
          flow.staves[staveKey] = stave;
        });
      });
    }),
  unassign_player: (flow_key: string, player_key: string) =>
    store.update((draft, state) => {
      // remove each instrument from the flow
      const player = state.score.players.by_key[player_key];
      player.instruments.forEach((instrumentKey) => {
        state.score.instruments[instrumentKey].staves.forEach((stave_key) => {
          delete draft.score.flows.by_key[flow_key].staves[stave_key];
        });
      });

      delete draft.score.flows.by_key[flow_key].players[player_key];
    }),
  remove: (flow_key: string) =>
    store.update((draft, state) => {
      draft.score.flows.order = state.score.flows.order.filter((k) => k !== flow_key);
      delete draft.score.flows.by_key[flow_key];
    }),
};
