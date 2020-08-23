import { Player } from "solo-composer-scheduler";
import { PlayerType } from "./defs";
import { create_player } from "./utils";
import { store } from "../use-store";
import { move } from "../utils";
import { get_def } from "../score-instrument/utils";
import { create_stave } from "../score-stave/utils";

export const playerActions = {
    create: (player_type: PlayerType): string => {
        const player = create_player(player_type);
        store.update((draft, state) => {
            draft.score.players.order.push(player.key);
            draft.score.players.by_key[player.key] = player;

            state.score.flows.order.forEach((flowKey) => {
                draft.score.flows.by_key[flowKey].players.push(player.key);
            });
        });
        return player.key;
    },
    assign_instrument: (player_key: string, instrument_key: string) =>
        store.update((draft, state) => {
            draft.score.players.by_key[player_key].instruments.push(
                instrument_key
            );
            const instrument = state.score.instruments[instrument_key];

            state.score.flows.order.forEach((flowKey) => {
                const flow = draft.score.flows.by_key[flowKey];
                if (flow.players.includes(player_key)) {
                    const instrumentDef = get_def(instrument.id);
                    instrument.staves.forEach((staveKey, i) => {
                        const staveDef = instrumentDef.staves[i];
                        const stave = create_stave(staveKey, staveDef);
                        flow.staves[staveKey] = stave;
                    });
                }
            });
        }),
    reorder: (old_index: number, new_index: number) =>
        store.update((draft) => {
            move(draft.score.players.order, old_index, new_index);
        }),
    remove: (player_key: string) => {
        store.update((draft, state) => {
            // for each instrument...
            state.score.players.by_key[player_key].instruments.forEach(
                (instrument_key) => {
                    // destroy instrument staves in each flow
                    state.score.flows.order.forEach((flow_key) => {
                        const flow = state.score.flows.by_key[flow_key];
                        if (flow.players.includes(player_key)) {
                            state.score.instruments[
                                instrument_key
                            ].staves.forEach((stave_key) => {
                                delete draft.score.flows.by_key[flow_key]
                                    .staves[stave_key];
                            });
                        }
                    });

                    // delete the actual instrument
                    delete draft.score.instruments[instrument_key];

                    // destroy the playback
                    delete draft.playback.instruments[instrument_key];
                    Player.disconnect(instrument_key);
                }
            );

            // remove the player from each flow
            state.score.flows.order.forEach((flow_key) => {
                draft.score.flows.by_key[
                    flow_key
                ].players = state.score.flows.by_key[flow_key].players.filter(
                    (k) => k !== player_key
                );
            });

            // remove the player itself
            delete draft.score.players.by_key[player_key];
            draft.score.players.order = state.score.players.order.filter(
                (k) => k !== player_key
            );
        });
    },
};
