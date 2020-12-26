import { FC, useState } from "react";
import { mdiCogOutline, mdiPlus } from "@mdi/js";
import { Icon } from "../../../ui";
import { CollpaseDirection, Panel } from "../../components/panel";
import { PanelHeader } from "../../components/panel-header";
import { useStore } from "../../store/use-store";
import { actions } from "../../store/actions";
import { EngraveSettings } from "../../dialogs/engrave-settings";

import "./styles.css";

interface Props {}

export const LayoutList: FC<Props> = () => {
  const open = useStore((s) => s.ui.setup.panels.layouts);
  const [settings, setSettings] = useState<boolean>(false);
  return (
    <>
      <Panel
        className="layout-list"
        collapse={CollpaseDirection.Left}
        collapsed={!open}
        onToggle={actions.ui.setup.panels.toggle.layouts}
      >
        <PanelHeader>
          <span className="layout-list__label">Layouts</span>
          <Icon style={{ marginRight: 12 }} size={24} path={mdiCogOutline} onClick={() => setSettings(true)} />
          <Icon disabled size={24} path={mdiPlus} onClick={() => {}} />
        </PanelHeader>
      </Panel>

      <EngraveSettings width={1200} open={settings} onClose={() => setSettings(false)} />
    </>
  );
};
