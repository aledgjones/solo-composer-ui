import { Player } from "solo-composer-scheduler";
import { create_instrument } from "./utils";
import { store } from "../use-store";
import { move } from "../utils";

export const instrumentActions = {
    create: (id: string): string => {
        const instrument = create_instrument(id);
        store.update((draft) => {
            draft.score.instruments[instrument.key] = instrument;
        });
        return instrument.key;
    },
    reorder: (player_key: string, old_index: number, new_index: number) =>
        store.update((draft) => {
            move(
                draft.score.players.by_key[player_key].instruments,
                old_index,
                new_index
            );
        }),
    remove: (player_key: string, instrument_key: string) =>
        store.update((draft, state) => {
            // destroy instrument staves in each flow
            state.score.flows.order.forEach((flow_key) => {
                const flow = state.score.flows.by_key[flow_key];
                if (flow.players.includes(player_key)) {
                    state.score.instruments[instrument_key].staves.forEach(
                        (stave_key) => {
                            delete draft.score.flows.by_key[flow_key].staves[
                                stave_key
                            ];
                        }
                    );
                }
            });

            // delete the instrument from the player
            draft.score.players.by_key[
                player_key
            ].instruments = state.score.players.by_key[
                player_key
            ].instruments.filter((k) => k !== instrument_key);

            // delete the actual instrument
            delete draft.score.instruments[instrument_key];

            // destroy the playback
            delete draft.playback.instruments[instrument_key];
            Player.disconnect(instrument_key);
        }),
    /**
     * Set volume of an instrument 0 - 100
     */
    volume(instrument_key: string, volume: number) {
        const value = parseInt(volume.toFixed(0));
        store.update((draft) => {
            draft.score.instruments[instrument_key].volume = value;
        });
        Player.volume(instrument_key, value / 100);
    },
    mute(instrument_key: string) {
        store.update((draft) => {
            draft.score.instruments[instrument_key].mute = true;
        });
        Player.mute(instrument_key);
    },
    unmute(instrument_key: string) {
        store.update((draft) => {
            draft.score.instruments[instrument_key].mute = false;
        });
        Player.unmute(instrument_key);
    },
    solo(instrument_key: string) {
        store.update((draft) => {
            draft.score.instruments[instrument_key].solo = true;
        });
        Player.solo(instrument_key);
    },
    unsolo(instrument_key: string) {
        store.update((draft) => {
            draft.score.instruments[instrument_key].solo = false;
        });
        Player.unsolo(instrument_key);
    },
};
