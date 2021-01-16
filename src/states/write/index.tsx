import { FC, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Option, Select, useTitle } from "../../ui";
import { CollpaseDirection, Panel } from "../../components/panel";
import { Popover } from "../../components/popover";
import { RenderRegion } from "../../components/render-region";
import { Renderer } from "../../components/renderer";
import { actions } from "../../store/actions";
import { PopoverType } from "../../store/ui/defs";
import { useStore } from "../../store/use-store";
import { barCommands, keySignatureCommands, tempoCommands, timeSignatureCommands } from "./hotkeys";
import { TimeSignaturePanel } from "./panels/time-signature";
import { pitchToParts } from "../../store/entries/utils";
import { Accidental, EntryType, NoteDuration } from "../../store/entries/defs";
import { Tone } from "../../store/entries/tone/defs";
import { Text } from "../../components/text";

import "./styles.css";
import { Snap } from "../../components/snap";

export function tokenFromAccidentalType(type: Accidental) {
  switch (type) {
    case Accidental.DoubleFlat:
      return "";
    case Accidental.Flat:
      return "${flat}";
    case Accidental.Sharp:
      return "${sharp}";
    case Accidental.DoubleSharp:
      return "";
    case Accidental.Natural:
    default:
      return "";
  }
}

const Write: FC = () => {
  useTitle("Solo Composer | Write");

  const [flowKey, panel, popover, selection, tick] = useStore((s) => [
    s.ui.flow_key || s.score.flows.order[0],
    s.ui.write.panels.elements,
    s.ui.write.popover,
    s.ui.selection,
    s.ui.write.tick,
  ]);

  useHotkeys("esc", actions.ui.selection.clear);

  useHotkeys("shift+k", () => actions.ui.write.popover.show(PopoverType.KeySignature));
  useHotkeys("shift+m", () => actions.ui.write.popover.show(PopoverType.TimeSignature));
  useHotkeys("shift+b", () => actions.ui.write.popover.show(PopoverType.Bar));
  useHotkeys("shift+t", () => actions.ui.write.popover.show(PopoverType.Tempo));

  const description = useMemo(() => {
    const keys = Object.keys(selection);
    const out = keys.map((key) => {
      const entry = selection[key];
      switch (entry.type) {
        case EntryType.Tone: {
          const tone = entry as Tone;
          const [letter, accidental, octave] = pitchToParts(tone.pitch);
          return `${letter}${tokenFromAccidentalType(accidental)}${octave}`;
        }
        default:
          return "";
      }
    });

    if (out.length === 0) {
      return "No Selection";
    } else {
      return "Selection: " + out.join(", ");
    }
  }, [selection]);

  return (
    <>
      <div className="write">
        <RenderRegion className="write__renderer">
          <Renderer
            selection={selection}
            onSelect={(entry) => {
              actions.ui.write.tick.set(entry.tick);
              actions.ui.selection.clear();
              actions.ui.selection.select(entry);
            }}
          >
            {popover === PopoverType.KeySignature && (
              <Popover
                icon={"\u{E262}"}
                onCommand={(value) => keySignatureCommands(flowKey, tick, value)}
                onHide={actions.ui.write.popover.hide}
              />
            )}
            {popover === PopoverType.TimeSignature && (
              <Popover
                icon={"\u{E08B}"}
                onCommand={(value) => timeSignatureCommands(flowKey, tick, value)}
                onHide={actions.ui.write.popover.hide}
              />
            )}
            {popover === PopoverType.Bar && (
              <Popover
                icon={"\u{E4EE}"}
                onCommand={(value) => barCommands(flowKey, tick, value)}
                onHide={actions.ui.write.popover.hide}
              />
            )}
            {popover === PopoverType.Tempo && (
              <Popover
                icon={"\u{E1D0}"}
                onCommand={(value) => tempoCommands(flowKey, tick, value)}
                onHide={actions.ui.write.popover.hide}
              />
            )}
          </Renderer>
        </RenderRegion>
        <Panel
          className="write__right-panel"
          collapse={CollpaseDirection.Left}
          collapsed={!panel}
          onToggle={actions.ui.write.panels.toggle.elements}
        >
          <TimeSignaturePanel />
        </Panel>
      </div>
      <div className="write__bottom-panel">
        <Snap />
        <div className="write__bottom-panel-section">
          <div className="write__selection">
            <Text content={description} />
          </div>
        </div>
        <div style={{ flexGrow: 1 }} />
      </div>
    </>
  );
};

export default Write;
