import { remove_entry, insert_entry, move_entry } from "../../score-track/utils";
import { store } from "../../use-store";
import { create_tone } from "./utils";
import { Tone } from "./defs";
import { Pitch, Articulation } from "..";

export const toneActions = {
    /**
     * Create a new tone.
     *
     * With MIDI pitches, tick counts and velocity 0-127
     */
    create: (
        flow_key: string,
        stave_key: string,
        track_key: string,
        tick: number,
        duration: number,
        pitch: Pitch,
        velocity: number,
        articulation: Articulation
    ): string => {
        const tone = create_tone(tick, duration, pitch, velocity, articulation);

        store.update((draft, state) => {
            insert_entry(draft.score.flows.by_key[flow_key].staves[stave_key].tracks.by_key[track_key], tone);
        });

        return tone.key;
    },
    update: (
        flow_key: string,
        stave_key: string,
        track_key: string,
        entry_key: string,
        tick: number,
        duration: number,
        pitch: Pitch,
        articulation: Articulation
    ) => {
        store.update((draft) => {
            move_entry(draft.score.flows.by_key[flow_key].staves[stave_key].tracks.by_key[track_key], entry_key, tick);
            const tone = draft.score.flows.by_key[flow_key].staves[stave_key].tracks.by_key[track_key].entries.by_key[
                entry_key
            ] as Tone;
            tone.duration = duration;
            tone.pitch = pitch;
            tone.articulation = articulation;
        });
    },
    slice: (flow_key: string, stave_key: string, track_key: string, entry_key: string, slice_at: number) => {
        store.update((draft, state) => {
            const track = draft.score.flows.by_key[flow_key].staves[stave_key].tracks.by_key[track_key];
            const old_tone = track.entries.by_key[entry_key] as Tone;
            const new_tone = create_tone(
                slice_at,
                old_tone.duration - (slice_at - old_tone.tick),
                old_tone.pitch,
                old_tone.velocity,
                old_tone.articulation
            );
            insert_entry(track, new_tone);
            old_tone.duration = slice_at - old_tone.tick;
        });
    },
    remove: (flow_key: string, stave_key: string, track_key: string, entry_key: string) => {
        store.update((draft) => {
            remove_entry(draft.score.flows.by_key[flow_key].staves[stave_key].tracks.by_key[track_key], entry_key);
        });
    },
};
