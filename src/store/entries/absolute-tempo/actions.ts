import { NoteDuration } from "..";
import { create_absolute_tempo } from "./utils";
import { insert_entry } from "../../score-track/utils";
import { store } from "../../use-store";

export const absoluteTempoActions = {
    create: (
        flow_key: string,
        tick: number,
        text: string,
        beat_type: NoteDuration,
        dotted: number,
        bpm: number,
        parenthesis_visible: boolean,
        text_visible: boolean,
        bpm_visible: boolean
    ): string => {
        const tempo = create_absolute_tempo(
            tick,
            text,
            beat_type,
            dotted,
            bpm,
            parenthesis_visible,
            text_visible,
            bpm_visible
        );

        store.update((draft, state) => {
            // insert the new tempo
            insert_entry(draft.score.flows.by_key[flow_key].master, tempo, true);
        });

        return tempo.key;
    },
};
