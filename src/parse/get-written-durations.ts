import { Flow } from "../store/score-flow/defs";
import { NotationTracks } from "./notation-track";
import { Player } from "../store/score-player/defs";
import { Instrument } from "../store/score-instrument/defs";
import { splitAtToneEvents } from "./split-at-tone-events";
import { splitAsPerMeter } from "./split-as-per-meter";

/**
 * Convert tones into written notation values
 */
export function getWrittenDurations(
    players: { order: string[]; by_key: { [key: string]: Player } },
    instruments: { [key: string]: Instrument },
    flow: Flow,
    barlines: Set<number>
) {
    return players.order.reduce<NotationTracks>((output, player_key) => {
        if (flow.players[player_key]) {
            const player = players.by_key[player_key];
            player.instruments.forEach((instrument_key) => {
                const instrument = instruments[instrument_key];
                instrument.staves.forEach((stave_key) => {
                    const stave = flow.staves[stave_key];
                    stave.tracks.order.forEach((track_key) => {
                        const track = stave.tracks.by_key[track_key];
                        const notation = splitAtToneEvents(flow.length, track);
                        output[track_key] = splitAsPerMeter(flow, notation, barlines);
                    });
                });
            });
        }
        return output;
    }, {});
}
