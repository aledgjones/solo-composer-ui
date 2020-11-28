import { StaveDef } from "../score-instrument/defs";
import { Stave } from "./defs";
import { create_track, insert_entry } from "../score-track/utils";
import { createClef } from "../entries/clef/utils";

export function create_stave(key: string, staveDef: StaveDef): Stave {
  const clef = createClef(
    0,
    staveDef.clef.pitch,
    staveDef.clef.offset,
    staveDef.clef.draw_as
  );
  const master = create_track();
  insert_entry(master, clef);

  const primary = create_track();

  return {
    key,
    lines: staveDef.lines,
    master,
    tracks: {
      order: [primary.key],
      by_key: {
        [primary.key]: primary,
      },
    },
  };
}
