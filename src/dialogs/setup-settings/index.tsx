import { useState } from "react";
import { Dialog, Subheader, Select, Option, Label, Button } from "../../../ui";
import { MenuItem } from "../../components/menu-item";
import { useStore } from "../../store/use-store";
import { PlayerType } from "../../store/score-player/defs";
import { AutoCountStyle } from "../../store/score-config/defs";
import { actions } from "../../store/actions";

import "../generic-settings.css";

enum Page {
  AutoNumbering,
}

interface Props {
  onClose: () => void;
}

export const SetupSettings = Dialog<Props>(({ onClose }) => {
  const [page, setPage] = useState<Page>(Page.AutoNumbering);
  const config = useStore((s) => s.score.config);

  return (
    <div className="setup-settings generic-settings">
      <div className="generic-settings__content">
        <div className="generic-settings__left-panel">
          <MenuItem selected={page === Page.AutoNumbering} onClick={() => setPage(Page.AutoNumbering)}>
            Auto Numbering
          </MenuItem>
        </div>

        <div className="generic-settings__right-panel">
          {page === Page.AutoNumbering && (
            <>
              <div className="generic-settings__section">
                <Subheader>Numbering Style</Subheader>
                <Subheader subtle>Solo Player</Subheader>
                <Select
                  margin
                  value={config.auto_count[PlayerType.Solo]}
                  onChange={(val: AutoCountStyle) => actions.score.config.auto_count.solo(val)}
                >
                  <Option value={AutoCountStyle.Arabic} displayAs="Arabic">
                    <Label>
                      <p>Arabic</p>
                      <p>1, 2, 3...</p>
                    </Label>
                  </Option>
                  <Option value={AutoCountStyle.Roman} displayAs="Roman">
                    <Label>
                      <p>Roman</p>
                      <p>I, II, III...</p>
                    </Label>
                  </Option>
                </Select>
                <Subheader subtle>Section Player</Subheader>
                <Select
                  value={config.auto_count[PlayerType.Section]}
                  onChange={(val: AutoCountStyle) => actions.score.config.auto_count.section(val)}
                >
                  <Option value={AutoCountStyle.Arabic} displayAs="Arabic">
                    <Label>
                      <p>Arabic</p>
                      <p>1, 2, 3...</p>
                    </Label>
                  </Option>
                  <Option value={AutoCountStyle.Roman} displayAs="Roman">
                    <Label>
                      <p>Roman</p>
                      <p>I, II, III...</p>
                    </Label>
                  </Option>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="generic-settings__buttons">
        <div className="generic-settings__spacer" />
        <Button compact onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
});
