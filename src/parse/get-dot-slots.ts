import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";
import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { getIsDotted, Notation, NotationTrack, NotationTracks } from "./notation-track";

export type Dots = Map<number, Set<number>>;
export interface DotsByTrack {
  [trackKey: string]: Dots;
}

function isCloseEnough(slot: number, entry: Notation, offsets: ToneVerticalOffsets) {
  for (let i = 0; i < entry.tones.length; i++) {
    const offset = offsets.get(entry.tones[i].key);
    if (slot >= offset - 2 && slot <= offset + 2) {
      return true;
    }
  }

  return false;
}

function allDotsDrawnApproach(entry: Notation, offsets: ToneVerticalOffsets) {
  const slots: Set<number> = new Set();

  entry.tones.forEach((tone) => {
    const offset = offsets.get(tone.key);
    const isSpace = offset % 2 !== 0;
    if (isSpace) {
      slots.add(offset);
    }
  });

  for (let i = entry.tones.length - 1; i >= 0; i--) {
    const tone = entry.tones[i];
    const offset = offsets.get(tone.key);
    const isLine = offset % 2 === 0;
    if (isLine) {
      let n = 0;
      let direction = -1;
      let slot = offset + (1 + n * 2) * direction;
      // zig zag out from the note keep going until you find the closest empty slot
      while (slots.has(slot)) {
        if (direction === 1) {
          n++;
        }
        direction = direction * -1;
        slot = offset + (1 + n * 2) * direction;
      }
      // if the slot is only 1 space away from the chord we can add a dot
      if (isCloseEnough(slot, entry, offsets)) {
        slots.add(slot);
      } else {
        // if you can't fit the dot close enough to the end
        // of the cluster try moving it to the other end
        direction = direction * -1;
        do {
          slot = slot + 2 * direction;
        } while (slots.has(slot));
        if (isCloseEnough(slot, entry, offsets)) {
          slots.add(slot);
        } else {
          // we can't draw the dot close enough so we can bail out here.
          return null;
        }
      }
    }
  }
  return slots;
}

function tightlySpacedDotsApproach(entry: Notation, offsets: ToneVerticalOffsets) {
  const slots: Set<number> = new Set();
  entry.tones.forEach((tone) => {
    const offset = offsets.get(tone.key);
    const isSpace = offset % 2 !== 0;
    if (isSpace) {
      slots.add(offset);
    }
  });

  entry.tones.forEach((tone) => {
    const offset = offsets.get(tone.key);
    const isLine = offset % 2 === 0;
    if (isLine) {
      if (!slots.has(offset - 1)) {
        slots.add(offset - 1);
      } else {
        slots.add(offset + 1);
      }
    }
  });
  return slots;
}

export function getDotSlotsInTick(entry: Notation, offsets: ToneVerticalOffsets) {
  const slots = allDotsDrawnApproach(entry, offsets);
  if (slots === null) {
    // if you can't fit all the dots close enough we revert to a tighter approach
    return tightlySpacedDotsApproach(entry, offsets);
  } else {
    return slots;
  }
}

export function getDotSlotsInTrack(flow: Flow, track: NotationTrack, offsets: ToneVerticalOffsets) {
  const dots: Dots = new Map();
  const ticks = Object.keys(track).map((t) => parseInt(t));
  ticks.forEach((tick) => {
    const entry = track[tick];
    const isDotted = getIsDotted(entry.duration, flow.subdivisions);
    if (isDotted) {
      dots.set(tick, getDotSlotsInTick(entry, offsets));
    }
  });
  return dots;
}

export function getDotSlots(flow: Flow, staves: Stave[], notation: NotationTracks, offsets: ToneVerticalOffsets) {
  const dots: DotsByTrack = {};
  staves.forEach((stave) => {
    stave.tracks.order.forEach((trackKey) => {
      const track = notation[trackKey];
      dots[trackKey] = getDotSlotsInTrack(flow, track, offsets);
    });
  });
  return dots;
}
