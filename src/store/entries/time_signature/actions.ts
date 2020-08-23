import { NoteDuration, EntryType } from "..";
import { TimeSignatureDrawType, TimeSignature } from "./defs";
import { store } from "../../use-store";
import {
    create_time_signature,
    get_entry_after_tick,
    get_entries_at_tick,
    duration_to_ticks,
} from "./utils";
import { insert_entry, move_entry } from "../../score-track/utils";

export const timeSignatureActions = {
    create: (
        flow_key: string,
        tick: number,
        beats: number,
        beat_type: NoteDuration,
        draw_type: TimeSignatureDrawType,
        groupings?: number[]
    ): string => {
        const time_signature = create_time_signature(
            tick,
            beats,
            beat_type,
            draw_type,
            groupings
        );
        store.update((draft, state) => {
            const flow = state.score.flows.by_key[flow_key];
            insert_entry(
                draft.score.flows.by_key[flow_key].master,
                time_signature,
                true
            );
            const ticks_per_bar =
                duration_to_ticks(time_signature.beat_type, flow.subdivisions) *
                time_signature.beats;
            const next = get_entry_after_tick(
                tick,
                flow.master,
                EntryType.TimeSignature
            ) as TimeSignature;
            const overflow = next
                ? (next.tick - tick) % ticks_per_bar
                : (flow.length - tick) % ticks_per_bar;

            if (overflow > 0) {
                // add aditional ticks to flow length to make full bars
                draft.score.flows.by_key[flow_key].length =
                    flow.length + (ticks_per_bar - overflow);
            }

            // move the future time signatures by the offset
            for (let i = tick + 1; i < flow.length; i++) {
                const entries = get_entries_at_tick(
                    i,
                    flow.master,
                    EntryType.TimeSignature
                );
                entries.forEach((entry) => {
                    move_entry(
                        draft.score.flows.by_key[flow_key].master,
                        entry.key,
                        i + (ticks_per_bar - overflow)
                    );
                });
            }
        });

        return time_signature.key;
    },
};
