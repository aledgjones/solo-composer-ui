import React, { useState } from "react";

import "../generic-settings.css";
import { Dialog, Button, Subheader, Select, Option, ListItem, Label, Switch } from "../../ui";
import { useActions, useStore } from "../../use-store";
import { MenuItem } from "../../components/menu-item";
import { ThemeMode } from "solo-composer-parser";

enum Page {
    General,
    NoteInput
}

interface Props {
    onClose: () => void;
}

export const Preferences = Dialog<Props>(({ onClose }) => {
    const actions = useActions();
    const [theme, audition] = useStore((s) => [s.app.theme, s.app.audition]);

    const [page, setPage] = useState<Page>(Page.General);

    return (
        <div className="generic-settings">
            <div className="generic-settings__content">
                <div className="generic-settings__left-panel">
                    <MenuItem selected={page === Page.General} onClick={() => setPage(Page.General)}>
                        General
                    </MenuItem>
                    <MenuItem selected={page === Page.NoteInput} onClick={() => setPage(Page.NoteInput)}>
                        Note Input &amp; Editing
                    </MenuItem>
                </div>

                <div className="generic-settings__right-panel">
                    {page === Page.General && (
                        <>
                            <div className="generic-settings__section">
                                <Subheader>General</Subheader>
                                <Select label="Language" value="en-gb" onChange={() => {}}>
                                    <Option value="en-gb" displayAs="English (UK)">
                                        English (UK)
                                    </Option>
                                </Select>
                            </div>
                            <div className="generic-settings__section">
                                <Subheader>THEME</Subheader>
                                <Select
                                    margin
                                    label="Mode"
                                    value={theme}
                                    onChange={(mode: ThemeMode) => actions.app.theme(mode)}
                                >
                                    <Option value={ThemeMode.Dark} displayAs="Dark">
                                        <Label>
                                            <p>Dark</p>
                                            <p>Default</p>
                                        </Label>
                                    </Option>
                                    <Option value={ThemeMode.Light} displayAs="Light">
                                        Light
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
                            <ListItem onClick={() => actions.app.audition(!audition)}>
                                <Label>
                                    <p>Enable auditioning</p>
                                    <p>Play notes during note input and selection</p>
                                </Label>
                                <Switch value={audition} />
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
