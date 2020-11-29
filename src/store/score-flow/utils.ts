import shortid from "shortid";
import { Flow, TickList } from "./defs";
import { create_track, insert_entry } from "../score-track/utils";
import {
  create_time_signature,
  duration_to_ticks,
  distance_from_barline,
  is_on_beat_type,
  is_on_grouping_boundry,
} from "../entries/time-signature/utils";
import { NoteDuration, Entry, EntryType } from "../entries";
import { TimeSignatureDrawType, TimeSignature } from "../entries/time-signature/defs";
import { useStore } from "../use-store";
import { useMemo } from "react";

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

export function useTicks(): TickList {
  const [length, subdivisions, master] = useStore((s) => {
    const flow_key = s.ui.flow_key;
    return [
      s.score.flows.by_key[flow_key].length,
      s.score.flows.by_key[flow_key].subdivisions,
      s.score.flows.by_key[flow_key].master,
    ];
  });

  return useMemo(() => {
    const quarter_width = 72.0;
    const ticks: TickList = {
      list: [],
      width: 0,
    };

    let time_signature: TimeSignature = null;

    for (let tick = 0; tick < length; tick++) {
      const entries = master.entries.by_tick[tick] || [];
      const result = entries
        .map((key): Entry => master.entries.by_key[key])
        .filter((entry) => entry.type === EntryType.TimeSignature);

      if (result.length > 0) {
        time_signature = result[0] as TimeSignature;
      }

      let ticks_per_quarter = duration_to_ticks(NoteDuration.Quarter, subdivisions);
      let distance = distance_from_barline(tick, subdivisions, time_signature);

      const tick_width = quarter_width / ticks_per_quarter;

      ticks.list.push({
        tick,
        x: ticks.width,
        width: tick_width,
        is_beat: is_on_beat_type(tick, subdivisions, time_signature, time_signature.beat_type),
        is_first_beat: distance === 0,
        is_quaver_beat: is_on_beat_type(tick, subdivisions, time_signature, NoteDuration.Eighth),
        is_grouping_boundry: is_on_grouping_boundry(tick, subdivisions, time_signature),
      });

      ticks.width = ticks.width + tick_width;
    }

    return ticks;
  }, [length, subdivisions, master]);
}
