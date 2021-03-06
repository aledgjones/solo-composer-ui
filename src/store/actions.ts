import { scoreActions } from "./score/actions";
import { appActions } from "./app/actions";
import { engravingActions } from "./score-engraving/actions";
import { flowActions } from "./score-flow/actions";
import { configActions } from "./score-config/actions";
import { playbackActions } from "./playback";
import { instrumentActions } from "./score-instrument/actions";
import { playerActions } from "./score-player/actions";
import { timeSignatureActions } from "./entries/time-signature/actions";
import { absoluteTempoActions } from "./entries/absolute-tempo/actions";
import { toneActions } from "./entries/tone/actions";
import { uiActions } from "./ui/actions";
import { barlineActions } from "./entries/barline/actions";
import { keySignatureActions } from "./entries/key-signature/actions";
import { clefActions } from "./entries/clef/actions";
import { developerActions } from "./developer/actions";

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
      barline: barlineActions,
      clef: clefActions,
      time_signature: timeSignatureActions,
      key_signature: keySignatureActions,
      absolute_tempo: absoluteTempoActions,
      tone: toneActions,
    },
  },
  ui: uiActions,
  developer: developerActions,
};

// debuggable
const self = window as any;
self._actions = actions;
