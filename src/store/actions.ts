// I know these are just wrapping funcs but it allows more acurate typings than wasm-pack produces

import { scoreActions } from "./score/actions";
import { appActions } from "./app/actions";
import { engravingActions } from "./score-engraving/actions";
import { flowActions } from "./score-flow/actions";
import { configActions } from "./score-config/actions";
import { playbackActions } from "./playback";
import { instrumentActions } from "./score-instrument/actions";
import { playerActions } from "./score-player/actions";
import { timeSignatureActions } from "./entries/time_signature/actions";
import { absoluteTempoActions } from "./entries/absolute_tempo/actions";
import { toneActions } from "./entries/tone/actions";
import { uiActions } from "./ui/actions";

// and it's really easy to swap between js and wasm funcs if needed.
export const actions = {
    app: appActions,
    playback: playbackActions,
    score: {
        ...scoreActions,
        config: configActions,
        engraving: engravingActions,
        flow: flowActions,
        player: playerActions,
        instrument: instrumentActions,
        entries: {
            time_signature: timeSignatureActions,
            absolute_tempo: absoluteTempoActions,
            tone: toneActions,
        },
    },
    ui: uiActions,
};

// debuggable
const self = window as any;
self._actions = actions;
