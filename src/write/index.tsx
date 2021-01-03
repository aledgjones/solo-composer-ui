import { FC } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTitle } from "../../ui";
import { CollpaseDirection, Panel } from "../components/panel";
import { Popover } from "../components/popover";
import { RenderRegion } from "../components/render-region";
import { Renderer } from "../components/renderer";
import { actions } from "../store/actions";
import { PopoverType } from "../store/ui/defs";
import { useStore } from "../store/use-store";
import { barCommands, keySignatureCommands, tempoCommands, timeSignatureCommands } from "./hotkeys";
import { TimeSignaturePanel } from "./panels/time-signature";
// import { EngraveSettings } from "../../dialogs/engrave-settings";

import "./styles.css";

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

  return (
    <>
      <div className="write">
        <RenderRegion className="write__renderer">
          <Renderer
            selection={selection}
            onSelect={(entry, addative) => {
              actions.ui.write.tick.set(entry.tick);
              if (!addative) {
                actions.ui.selection.clear();
              }
              actions.ui.selection.select(entry.key);
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
    </>
  );
};

export default Write;
