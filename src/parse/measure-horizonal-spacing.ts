import { EngravingConfig } from "../store/defs";
import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";
import { getNoteSpacing } from "./get-note-spacing";
import { HorizontalSpacing, measureTick } from "./measure-tick";
import { NotationTracks } from "./notation-track";
import { WidthOf } from "./sum-width-up-to";

export function measureHorizontalSpacing(
  staves: Stave[],
  flow: Flow,
  barlines: Set<number>,
  notation: NotationTracks,
  engraving: EngravingConfig
) {
  const spacing: { [tick: number]: HorizontalSpacing } = {};
  for (let tick = 0; tick < flow.length; tick++) {
    spacing[tick] = measureTick(tick, staves, flow, barlines.has(tick), notation);
  }
  const trackKeys = Object.keys(notation);
  trackKeys.forEach((trackKey) => {
    const track = notation[trackKey];
    const ticks = Object.keys(track).map((key) => parseInt(key));
    ticks.forEach((tick) => {
      const entry = track[tick];
      const noteSpacing = getNoteSpacing(
        entry.duration,
        flow.subdivisions,
        engraving.baseNoteSpace,
        engraving.minNoteSpace,
        engraving.noteSpaceRatio
      );
      const noteSpacingPerTick = noteSpacing / entry.duration;
      for (let i = tick; i < tick + entry.duration; i++) {
        if (noteSpacingPerTick > spacing[i][WidthOf.NoteSpacing]) {
          spacing[i][WidthOf.NoteSpacing] = noteSpacingPerTick;
        }
      }
    });
  });
  return spacing;
}
