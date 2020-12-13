import shortid from "shortid";
import { Flow } from "./defs";
import { create_track, insert_entry } from "../score-track/utils";
import { create_time_signature } from "../entries/time-signature/utils";
import { NoteDuration } from "../entries/defs";
import { TimeSignatureDrawType } from "../entries/time-signature/defs";

export function create_flow(): Flow {
  const time_signature = create_time_signature(0, 4, NoteDuration.Quarter, TimeSignatureDrawType.Regular);
  const master = create_track();
  insert_entry(master, time_signature);
  return {
    key: shortid(),
    title: "",
    players: {},
    length: 16 * 4 * 4,
    subdivisions: 16,

    master,
    staves: {},
  };
}
