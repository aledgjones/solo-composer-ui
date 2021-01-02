import { ToneVerticalOffsets } from "./get-tone-vertical-offsets";
import { Notation, NotationTracks } from "./notation-track";

export function sortTones(notation: NotationTracks, offsets: ToneVerticalOffsets) {
  const tracks = Object.values(notation);
  tracks.forEach((track) => {
    const entries: Notation[] = Object.values(track);
    entries.forEach((entry) => {
      entry.tones.sort((a, b) => offsets.get(b.key) - offsets.get(a.key));
    });
  });
}
