import { Stave } from "../store/score-stave/defs";
import { StemDirectionsByTrack, StemDirectionType } from "./get-stem-directions";
import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { WidthOf } from "./measure-width-upto";
import { NotationTracks, Notation } from "./notation-track";

export type Shunts = Map<string, WidthOf>;

export function getNoteheadShuntsInChord(
  entry: Notation,
  offsets: ToneVerticalOffsets,
  stemDirection: StemDirectionType
) {
  const shunts = new Map();

  let cluster = [];
  for (let i = 0; i < entry.tones.length; i++) {
    const curr = entry.tones[i];
    const next = entry.tones[i + 1];
    if (next && offsets.get(curr.key) - offsets.get(next.key) <= 1) {
      cluster.push(curr);
    } else {
      cluster.push(curr);
      const isOddLength = cluster.length % 2 !== 0;
      cluster.forEach((tone, ii) => {
        const firstNoteheadIsShunted = stemDirection === StemDirectionType.Up || isOddLength;
        const shunted = firstNoteheadIsShunted ? ii % 2 !== 0 : ii % 2 === 0;
        if (shunted) {
          shunts.set(tone.key, stemDirection === StemDirectionType.Up ? WidthOf.PostNoteSlot : WidthOf.PreNoteSlot);
        } else {
          shunts.set(tone.key, WidthOf.NoteSlot);
        }
      });
      cluster = [];
    }
  }

  return shunts;
}

export function getNoteheadShunts(
  staves: Stave[],
  notation: NotationTracks,
  offsets: ToneVerticalOffsets,
  stemDirections: StemDirectionsByTrack
) {
  const shunts: Shunts = new Map();

  staves.forEach((stave) => {
    stave.tracks.order.forEach((trackKey) => {
      const track = notation[trackKey];
      const directions = stemDirections[trackKey];
      const ticks = Object.keys(track).map((t) => parseInt(t));
      ticks.forEach((tick) => {
        const entry = track[tick];
        const direction = directions.get(tick);
        const result = getNoteheadShuntsInChord(entry, offsets, direction);
        result.forEach((widthOf, key) => {
          shunts.set(key, widthOf);
        });
      });
    });
  });

  return shunts;
}
