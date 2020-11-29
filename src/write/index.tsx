import { FC } from "react";

import { useTitle } from "../../ui";
// import { CollpaseDirection, Panel } from "../components/panel";
import { RenderRegion } from "../components/render-region";
import { Renderer } from "../components/renderer";
// import { actions } from "../store/actions";
// import { useStore } from "../store/use-store";
// import { TimeSignaturePanel } from "./panels/time-signature";
// import { EngraveSettings } from "../../dialogs/engrave-settings";

import "./styles.css";

const Write: FC = () => {
  useTitle("Solo Composer | Write");
  // const open = useStore((s) => s.ui.write.panels.elements);

  return (
    <>
      <div className="write">
        <RenderRegion className="write__renderer">
          <Renderer />
        </RenderRegion>
        {/* <Panel
          className="write__right-panel"
          collapse={CollpaseDirection.Left}
          collapsed={!open}
          onToggle={actions.ui.write.panels.toggle.elements}
        >
          <TimeSignaturePanel />
        </Panel> */}
      </div>
    </>
  );
};

export default Write;
