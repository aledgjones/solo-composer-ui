import { FC } from "react";
import { mdiPlus } from "@mdi/js";
import { Icon } from "../../../ui";
import { CollpaseDirection, Panel } from "../../components/panel";
import { PanelHeader } from "../../components/panel-header";

import "./styles.css";
import { useStore } from "../../store/use-store";
import { actions } from "../../store/actions";

interface Props {}

export const LayoutList: FC<Props> = () => {
  const open = useStore((s) => s.ui.setup.panels.layouts);
  return (
    <Panel
      className="layout-list"
      collapse={CollpaseDirection.Left}
      collapsed={!open}
      onToggle={actions.ui.setup.panels.toggle.layouts}
    >
      <PanelHeader>
        <span className="layout-list__label">Layouts</span>
        <Icon disabled size={24} path={mdiPlus} onClick={() => {}} />
      </PanelHeader>
    </Panel>
  );
};
