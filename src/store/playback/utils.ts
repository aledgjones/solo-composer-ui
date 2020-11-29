import { useState, useEffect, useMemo } from "react";
import { Transport, Tick, Player } from "solo-composer-scheduler";
import { TimeSignature } from "../entries/time-signature/defs";
import { Entry, EntryType, NoteDuration } from "../entries";
import { duration_to_ticks, distance_from_barline } from "../entries/time-signature/utils";
import { useStore } from "../use-store";

export function useTick() {
  const [timestamp, setTimestamp] = useState(0);
  useEffect(() => {
    const cb = (tick: Tick) => setTimestamp(tick);
    Transport.on("tick", cb);

    return () => {
      Transport.removeListener("tick", cb);
    };
  }, []);
  return timestamp;
}

export function useWaveform(instrumentKey: string) {
  const [amplitude, setAmplitude] = useState(0);
  useEffect(() => {
    let running = true;
    const update = () => {
      if (running) {
        setAmplitude(Player.RMS(instrumentKey));
        requestAnimationFrame(update);
      }
    };

    update();

    return () => {
      running = false;
    };
  }, [instrumentKey]);
  return amplitude;
}

export function useTimestamp(current: number) {
  const [length, subdivisions, master] = useStore((s) => {
    const flow_key = s.ui.flow_key;
    return [
      s.score.flows.by_key[flow_key].length,
      s.score.flows.by_key[flow_key].subdivisions,
      s.score.flows.by_key[flow_key].master,
    ];
  });
  const timestamps = useMemo(() => {
    let bar = 0;
    let time_signature: TimeSignature = null;
    const stamps: string[] = [];

    // look for the previous time signature
    for (let tick = 0; tick <= length; tick++) {
      const entries = master.entries.by_tick[tick] || [];
      const result = entries
        .map(
          (key): Entry => {
            return master.entries.by_key[key];
          }
        )
        .filter((entry) => {
          return entry.type === EntryType.TimeSignature;
        });

      if (result.length > 0) {
        time_signature = result[0] as TimeSignature;
      }

      let ticks_per_quarter = duration_to_ticks(NoteDuration.Quarter, subdivisions);
      let ticks_per_sixteenth = duration_to_ticks(NoteDuration.Sixteenth, subdivisions);

      let distance = distance_from_barline(tick, subdivisions, time_signature);

      if (distance === 0) {
        bar++;
      }

      let beat = Math.floor(distance / ticks_per_quarter) + 1;
      let sixteenth = (distance % ticks_per_quarter) / ticks_per_sixteenth;

      stamps.push(`${bar}:${beat}:${sixteenth.toFixed(3)}`);
    }
    return stamps;
  }, [length, subdivisions, master]);

  return timestamps[current] || timestamps[timestamps.length - 1];
}
