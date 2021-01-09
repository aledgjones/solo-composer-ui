import { FC, PointerEvent, useRef, useCallback } from "react";
import { dragHandler } from "../../../ui";
import { ToneTrackEntry } from "../tone-track-entry";
import { SLOT_HEIGHT } from "../const";
import { getTickFromXPosition, getPitchFromYPosition, getStartOfTone, getDurationOfTone } from "../utils";
import { useStore } from "../../../store/use-store";
import { TickList } from "../../../store/score-flow/defs";
import { Tool } from "../../../store/ui/defs";
import { duration_to_ticks } from "../../../store/entries/time-signature/utils";
import { Tone } from "../../../store/entries/tone/defs";
import { EntryType, Articulation } from "../../../store/entries/defs";
import { actions } from "../../../store/actions";

import "./styles.css";
import { pitchFromNumber } from "../../../store/entries/utils";

interface Props {
  flowKey: string;
  instrumentKey: string;
  color: string;
  ticks: TickList;
  base: number;
  tool: Tool;
  slots: number;
  zoom: number;
}

export const ToneTrack: FC<Props> = ({ flowKey, instrumentKey, color, base, tool, ticks, slots, zoom }) => {
  const track = useRef<HTMLDivElement>(null);

  const [audition, snap, tones, disabled, staveKey, trackKey] = useStore(
    (s) => {
      const flow = s.score.flows.by_key[flowKey];
      const instrument = s.score.instruments[instrumentKey];

      const staveKey = s.ui.play.stave[instrumentKey] || instrument.staves[0];
      const stave = flow.staves[staveKey];
      const trackKey = stave.tracks.order[0];

      const disabled = new Set();
      const tones = instrument.staves.reduce<Tone[]>((out, stave_key) => {
        flow.staves[stave_key].tracks.order.forEach((track_key) => {
          const track = flow.staves[stave_key].tracks.by_key[track_key];
          Object.values(track.entries.by_key).forEach((entry) => {
            if (entry.type === EntryType.Tone) {
              // only disable tones if there is a selected stave
              if (s.ui.play.stave[instrumentKey] && stave_key !== staveKey) {
                disabled.add(entry.key);
              }
              out.push(entry as Tone);
            }
          });
        });
        return out;
      }, []);

      return [
        s.app.audition,
        duration_to_ticks(s.ui.snap, s.score.flows.by_key[flowKey].subdivisions),
        tones,
        disabled,
        staveKey,
        trackKey,
      ];
    },
    [flowKey, instrumentKey]
  );

  const onAudition = useCallback(
    (pitch: number) => {
      if (audition) {
        actions.playback.sampler.audition(instrumentKey, pitch);
      }
    },
    [instrumentKey, audition]
  );

  const onCreate = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (track.current && tool === Tool.Draw) {
        const box = track.current.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        const start = getTickFromXPosition(x, ticks, snap, zoom, "down");
        const duration = getTickFromXPosition(x, ticks, snap, zoom) - start;
        const pitch = getPitchFromYPosition(y, base, slots);
        const toneKey = actions.score.entries.tone.create(
          flowKey,
          staveKey,
          trackKey,
          start,
          duration,
          pitchFromNumber(pitch),
          100,
          Articulation.None
        );

        actions.ui.selection.clear();
        actions.ui.selection.select(toneKey);

        onEdit(e, toneKey, start, duration, pitch, Articulation.None, true, false, true);
        onAudition(pitch);
      }

      if (tool === Tool.Select) {
        actions.ui.selection.clear();
      }
    },
    [flowKey, staveKey, instrumentKey, trackKey, track, ticks, base, slots, tool, snap, audition, zoom, onAudition]
  );

  const onEdit = useCallback(
    (
      e: PointerEvent<HTMLElement>,
      toneKey: string,
      start: number,
      duration: number,
      pitch: number,
      articulation: Articulation,
      fixedStart: boolean,
      fixedDuration: boolean,
      fixedPitch: boolean
    ) => {
      const handler = dragHandler<{ box: DOMRect; x: number }>({
        onDown: (ev) => {
          if (track.current) {
            const box = track.current.getBoundingClientRect();
            return {
              box,
              x: ev.clientX - box.left,
            };
          } else {
            return false;
          }
        },
        onMove: (ev, init) => {
          const x = ev.clientX - init.box.left;
          const y = ev.clientY - init.box.top;

          const p = fixedPitch ? pitch : getPitchFromYPosition(y, base, slots);
          const s = getStartOfTone(x, init.x, ticks, snap, zoom, start, duration, fixedStart, fixedDuration);
          const d = getDurationOfTone(x, ticks, snap, zoom, start, duration, fixedStart, fixedDuration);
          actions.score.entries.tone.update(
            flowKey,
            staveKey,
            trackKey,
            toneKey,
            s,
            d,
            pitchFromNumber(p),
            articulation
          );
        },
        onEnd: (ev, init) => {
          const x = ev.clientX - init.box.left;
          const y = ev.clientY - init.box.top;
          const p = fixedPitch ? pitch : getPitchFromYPosition(y, base, slots);
          const d = getDurationOfTone(x, ticks, snap, zoom, start, duration, fixedStart, fixedDuration);
          if (p !== pitch) {
            onAudition(p);
          }
          if (d <= 0) {
            actions.score.entries.tone.remove(flowKey, staveKey, trackKey, toneKey);
          }
        },
      });

      handler(e);
    },
    [flowKey, staveKey, instrumentKey, trackKey, track, ticks, base, slots, snap, audition, zoom, onAudition]
  );

  const onSlice = useCallback(
    (e: PointerEvent<HTMLDivElement>, toneKey: string, start: number, duration: number) => {
      const box = track.current.getBoundingClientRect();
      const x = e.clientX - box.left;
      const slice = getTickFromXPosition(x, ticks, snap, zoom);

      if (slice > start && slice < start + duration) {
        actions.ui.selection.clear();
        actions.score.entries.tone.slice(flowKey, staveKey, trackKey, toneKey, slice);
      }
    },
    [flowKey, staveKey, trackKey, ticks, snap, zoom]
  );

  const onRemove = useCallback(
    (key: string) => {
      actions.ui.selection.clear();
      actions.score.entries.tone.remove(flowKey, staveKey, trackKey, key);
    },
    [flowKey, staveKey, trackKey]
  );

  return (
    <div
      ref={track}
      onPointerDown={onCreate}
      className="tone-track"
      style={{ width: ticks.width * zoom, height: SLOT_HEIGHT * slots }}
    >
      {tones.map((tone) => {
        return (
          <ToneTrackEntry
            key={tone.key}
            color={color}
            base={base}
            slots={slots}
            tone={tone}
            ticks={ticks}
            tool={tool}
            zoom={zoom}
            onRemove={onRemove}
            onEdit={onEdit}
            onSlice={onSlice}
            onAudition={onAudition}
            disabled={disabled.has(tone.key)}
          />
        );
      })}
    </div>
  );
};
