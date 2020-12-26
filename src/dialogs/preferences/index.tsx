import { useState } from "react";

import { Dialog, Button, Subheader, Select, Option, ListItem, Label, Switch } from "../../../ui";
import { MenuItem } from "../../components/menu-item";
import { useStore } from "../../store/use-store";
import { actions } from "../../store/actions";

import "../generic-settings.css";

enum Page {
  General,
  NoteInput,
  DeveloperTools,
}

interface Props {
  onClose: () => void;
}

export const Preferences = Dialog<Props>(({ onClose }) => {
  const [audition, debug] = useStore((s) => [s.app.audition, s.developer.debug]);
  const [page, setPage] = useState<Page>(Page.General);

  return (
    <div className="preferences generic-settings">
      <div className="generic-settings__content">
        <div className="generic-settings__left-panel">
          <MenuItem selected={page === Page.General} onClick={() => setPage(Page.General)}>
            General
          </MenuItem>
          <MenuItem selected={page === Page.NoteInput} onClick={() => setPage(Page.NoteInput)}>
            Note Input &amp; Editing
          </MenuItem>
          <MenuItem selected={page === Page.DeveloperTools} onClick={() => setPage(Page.DeveloperTools)}>
            Developer Tools
          </MenuItem>
        </div>

        <div className="generic-settings__right-panel">
          {page === Page.General && (
            <>
              <div className="generic-settings__section">
                <Subheader>Language</Subheader>
                <Select value="en-gb" onChange={() => {}}>
                  <Option value="en-gb" displayAs="English (UK)">
                    English (UK)
                  </Option>
                </Select>
              </div>
            </>
          )}

          {page === Page.NoteInput && (
            <>
              <div className="generic-settings__section" style={{ paddingBottom: 0 }}>
                <Subheader>Auditioning</Subheader>
              </div>
              <ListItem onClick={() => actions.app.audition.toggle()}>
                <Label>
                  <p>Enable auditioning</p>
                  <p>Play notes during note input and selection</p>
                </Label>
                <Switch value={audition} />
              </ListItem>
            </>
          )}

          {page === Page.DeveloperTools && (
            <>
              <div className="generic-settings__section" style={{ paddingBottom: 0 }}>
                <Subheader>Console</Subheader>
              </div>
              <ListItem onClick={() => actions.developer.debug.toggle()}>
                <Label>
                  <p>Enable debug highlights</p>
                  <p>Highlight elements on the score with a coloured bounding box</p>
                </Label>
                <Switch value={debug} />
              </ListItem>
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
