import React, { useState } from "react";
import { Dialog, Subheader, Select, Option, Label, Button, ListItem, Switch } from "../../../ui";
import { useStore, actions, InstrumentAutoCountStyle } from "../../../store";
import { MenuItem } from "../../components/menu-item";

import "../generic-settings.css";
import "./styles.css";

enum Page {
    AutoNumbering = 1
}

interface Props {
    onClose: () => void;
}

export const SetupSettings = Dialog<Props>(({ onClose }) => {
    const [page, setPage] = useState<Page>(Page.AutoNumbering);
    const config = useStore((s) => s.score.config);

    return (
        <div className="setup-settings">
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
                                <Subheader compact>Solo Players</Subheader>
                            </div>

                            <ListItem
                                onClick={() =>
                                    actions.score.config.auto_count.solo.active(!config.auto_count.solo.active)
                                }
                            >
                                <Label>
                                    <p>Enable auto numbering for Solo Players</p>
                                    <p>Instruments with the same name will have an auto incrimented number appended</p>
                                </Label>
                                <Switch value={config.auto_count.solo.active} />
                            </ListItem>

                            <div className="generic-settings__section">
                                <Subheader subtle>Numbering Style</Subheader>
                                <Select
                                    margin
                                    value={config.auto_count.solo.style}
                                    onChange={(val: InstrumentAutoCountStyle) =>
                                        actions.score.config.auto_count.solo.style(val)
                                    }
                                >
                                    <Option value={InstrumentAutoCountStyle.Arabic} displayAs="Arabic">
                                        <Label>
                                            <p>Arabic</p>
                                            <p>1, 2, 3...</p>
                                        </Label>
                                    </Option>
                                    <Option value={InstrumentAutoCountStyle.Roman} displayAs="Roman">
                                        <Label>
                                            <p>Roman</p>
                                            <p>I, II, III...</p>
                                        </Label>
                                    </Option>
                                </Select>
                            </div>
                            <div className="generic-settings__section">
                                <Subheader compact>Section Players</Subheader>
                            </div>
                            <ListItem
                                onClick={() =>
                                    actions.score.config.auto_count.section.active(!config.auto_count.section.active)
                                }
                            >
                                <Label>
                                    <p>Enable auto numbering for Section Players</p>
                                    <p>Instruments with the same name will have an auto incrimented number appended</p>
                                </Label>
                                <Switch value={config.auto_count.section.active} />
                            </ListItem>
                            <div className="generic-settings__section">
                                <Subheader subtle>Numbering Style</Subheader>
                                <Select
                                    value={config.auto_count.section.style}
                                    onChange={(val: InstrumentAutoCountStyle) =>
                                        actions.score.config.auto_count.section.style(val)
                                    }
                                >
                                    <Option value={InstrumentAutoCountStyle.Arabic} displayAs="Arabic">
                                        <Label>
                                            <p>Arabic</p>
                                            <p>1, 2, 3...</p>
                                        </Label>
                                    </Option>
                                    <Option value={InstrumentAutoCountStyle.Roman} displayAs="Roman">
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
