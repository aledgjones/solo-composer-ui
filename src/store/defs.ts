import { AppDefs } from "./app/defs";
import { PlaybackDefs } from "./playback/defs";
import { Score } from "./score/defs";
import { UiDefs } from "./ui/defs";

export * from "./playback/defs";
export * from "./score-engraving/defs";

export type MMs = number;
export type Spaces = number;

export interface State {
    app: AppDefs;
    playback: PlaybackDefs;
    score: Score;
    ui: UiDefs;
}
