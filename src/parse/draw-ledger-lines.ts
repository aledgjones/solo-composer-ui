import { Instruction } from "../render/instructions";
import { buildLine } from "../render/line";
import { Stave } from "../store/score-stave/defs";
import { Shunts } from "./get-notehead-shunts";
import { StemDirectionsByTrack, StemDirectionType } from "./get-stem-directions";
import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { HorizontalSpacing } from "./measure-tick";
import { VerticalSpacing } from "./measure-verical-spacing";
import { measureWidthUpto, WidthOf } from "./measure-width-upto";
import { Notation, NotationTracks } from "./notation-track";

function startWidthOf(stemDirection: StemDirectionType, width: number) {
  if (width === 1) {
    return WidthOf.NoteSlot;
  } else {
    if (stemDirection === StemDirectionType.Up) {
      return WidthOf.NoteSlot;
    } else {
      return WidthOf.PreNoteSlot;
    }
  }
}

function stopWidthOf(stemDirection: StemDirectionType, width: number) {
  if (width === 1) {
    return WidthOf.PostNoteSlot;
  } else {
    if (stemDirection === StemDirectionType.Up) {
      return WidthOf.NoteSpacing;
    } else {
      return WidthOf.PostNoteSlot;
    }
  }
}

export function drawLedgerLinesForEntry(
  tick: number,
  x: number,
  y: number,
  entry: Notation,
  offsets: ToneVerticalOffsets,
  stemDirection: StemDirectionType,
  shunts: Shunts,
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  key: string
) {
  const instructions: any = [];

  const highLedgerLines: Array<0 | 1 | 2> = [0, 0, 0];
  const lowLedgerLines: Array<0 | 1 | 2> = [0, 0, 0];

  for (let i = 0; i < entry.tones.length; i++) {
    const tone = entry.tones[i];
    const offset = offsets.get(tone.key);
    const shunt = shunts.get(`${tick}-${tone.key}`);
    const width = shunt < WidthOf.NoteSlot || shunt > WidthOf.NoteSlot ? 2 : 1;

    if (offset <= -6) {
      for (let i = 6; i <= Math.abs(offset); i++) {
        if (!highLedgerLines[Math.floor(i / 2)] || width > highLedgerLines[Math.floor(i / 2)]) {
          highLedgerLines[Math.floor(i / 2)] = width;
        }
      }
    }
    if (offset >= 6) {
      for (let i = 6; i <= offset; i++) {
        if (!lowLedgerLines[Math.floor(i / 2)] || width > lowLedgerLines[Math.floor(i / 2)]) {
          lowLedgerLines[Math.floor(i / 2)] = width;
        }
      }
    }
  }

  for (let i = 0; i < lowLedgerLines.length; i++) {
    const width = lowLedgerLines[i];
    if (width > 0) {
      const start = x + measureWidthUpto(horizontalSpacing, 0, tick, startWidthOf(stemDirection, width)) - 0.4;
      const stop = x + measureWidthUpto(horizontalSpacing, 0, tick, stopWidthOf(stemDirection, width)) + 0.4;
      instructions.push(
        buildLine(`${key}-${i}-low`, { color: "#000000", thickness: 0.1875 }, [start, y + i], [stop, y + i])
      );
    }
  }

  for (let i = 0; i < highLedgerLines.length; i++) {
    const width = highLedgerLines[i];
    if (width > 0) {
      const start = x + measureWidthUpto(horizontalSpacing, 0, tick, startWidthOf(stemDirection, width)) - 0.4;
      const stop = x + measureWidthUpto(horizontalSpacing, 0, tick, stopWidthOf(stemDirection, width)) + 0.4;
      instructions.push(
        buildLine(`${key}-${i}-high`, { color: "#000000", thickness: 0.1875 }, [start, y - i], [stop, y - i])
      );
    }
  }

  return instructions;
}

export function drawLedgerLines(
  x: number,
  y: number,
  staves: Stave[],
  notation: NotationTracks,
  horizontalSpacing: { [tick: number]: HorizontalSpacing },
  verticalSpacing: VerticalSpacing,
  toneVerticalOffsets: ToneVerticalOffsets,
  shunts: Shunts,
  stemDirections: StemDirectionsByTrack
) {
  const instructions: Instruction<any>[] = [];

  for (let i = 0; i < staves.length; i++) {
    const stave = staves[i];
    const top = y + verticalSpacing.staves[stave.key].y;

    for (let ii = 0; ii < stave.tracks.order.length; ii++) {
      const trackKey = stave.tracks.order[ii];
      const track = notation[trackKey];
      const directions = stemDirections[trackKey];
      const ticks = Object.keys(track).map((t) => parseInt(t));

      for (let iii = 0; iii < ticks.length; iii++) {
        const tick = ticks[iii];
        const entry = track[tick];
        // ignore rests
        if (entry.tones.length > 0) {
          instructions.push(
            ...drawLedgerLinesForEntry(
              tick,
              x,
              top,
              entry,
              toneVerticalOffsets,
              directions.get(tick),
              shunts,
              horizontalSpacing,
              `ledger-line-${trackKey}-${tick}`
            )
          );
        }
      }
    }
  }

  return instructions;
}
