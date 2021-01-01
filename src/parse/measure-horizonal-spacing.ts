import { EngravingConfig } from "../store/defs";
import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";
import { Barlines } from "./get-barlines";
import { getNoteSpacing } from "./get-note-spacing";
import { Shunts } from "./get-notehead-shunts";
import { HorizontalSpacing, measureTick } from "./measure-tick";
import { WidthOf } from "./measure-width-upto";
import { NotationTracks } from "./notation-track";

export function measureHorizontalSpacing(
  staves: Stave[],
  flow: Flow,
  barlines: Barlines,
  notation: NotationTracks,
  shunts: Shunts,
  engraving: EngravingConfig
) {
  const spacing: { [tick: number]: HorizontalSpacing } = {};
  for (let tick = 0; tick < flow.length; tick++) {
    spacing[tick] = measureTick(tick, staves, flow, barlines.has(tick), notation, shunts);
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
