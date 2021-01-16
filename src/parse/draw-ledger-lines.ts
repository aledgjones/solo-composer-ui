import { Instruction } from "../render/instructions";
import { buildLine } from "../render/line";
import { Stave } from "../store/score-stave/defs";
import { Shunts } from "./get-notehead-shunts";
import { StemDirectionsByTrack, StemDirectionType } from "./get-stem-directions";
import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { HorizontalOffsets, WidthOf } from "./measure-horizonal-offsets";
import { HorizontalSpacing } from "./measure-tick";
import { VerticalSpacing } from "./measure-verical-spacing";
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
  horizontalOffsets: HorizontalOffsets,
  key: string
) {
  const instructions: any = [];

  const highLedgerLines: Array<0 | 1 | 2> = [0, 0, 0];
  const lowLedgerLines: Array<0 | 1 | 2> = [0, 0, 0];

  entry.tones.forEach((tone) => {
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
  });

  lowLedgerLines.forEach((width, i) => {
    if (width > 0) {
      const start = x + horizontalOffsets.get(tick)[startWidthOf(stemDirection, width)] - 0.4;
      const stop = x + horizontalOffsets.get(tick)[stopWidthOf(stemDirection, width)] + 0.4;
      instructions.push(
        buildLine(`${key}-${i}-low`, { color: "#000000", thickness: 0.1875 }, [start, y + i], [stop, y + i])
      );
    }
  });

  highLedgerLines.forEach((width, i) => {
    if (width > 0) {
      const start = x + horizontalOffsets.get(tick)[startWidthOf(stemDirection, width)] - 0.4;
      const stop = x + horizontalOffsets.get(tick)[stopWidthOf(stemDirection, width)] + 0.4;
      instructions.push(
        buildLine(`${key}-${i}-high`, { color: "#000000", thickness: 0.1875 }, [start, y - i], [stop, y - i])
      );
    }
  });

  return instructions;
}

export function drawLedgerLines(
  x: number,
  y: number,
  staves: Stave[],
  notation: NotationTracks,
  horizontalOffsets: HorizontalOffsets,
  verticalSpacing: VerticalSpacing,
  toneVerticalOffsets: ToneVerticalOffsets,
  shunts: Shunts,
  stemDirections: StemDirectionsByTrack
) {
  const instructions: Instruction<any>[] = [];

  staves.forEach((stave) => {
    const top = y + verticalSpacing.staves[stave.key].y;
    stave.tracks.order.forEach((trackKey) => {
      const track = notation[trackKey];
      const directions = stemDirections[trackKey];
      const ticks = Object.keys(track).map((t) => parseInt(t));
      ticks.forEach((tick) => {
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
              horizontalOffsets,
              `ledger-line-${trackKey}-${tick}`
            )
          );
        }
      });
    });
  });

  return instructions;
}
