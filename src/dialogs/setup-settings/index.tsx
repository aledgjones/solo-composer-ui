import React, { useState } from "react";
import { Dialog, Subheader, Select, Option, Label, Button } from "../../ui";
import { useStore, actions, InstrumentAutoCountStyle } from "../../../store";
import { MenuItem } from "../../components/menu-item";

import "../generic-settings.css";

enum Page {
    StaveLabels = 1
}

interface Props {
    onClose: () => void;
}

export const SetupSettings = Dialog<Props>(({ onClose }) => {
    const [page, setPage] = useState<Page>(Page.StaveLabels);
    const config = useStore((s) => s.score.config);

    return (
        <div className="generic-settings">
            <div className="generic-settings__content">
                <div className="generic-settings__left-panel">
                    <MenuItem
                        selected={page === Page.StaveLabels}
                        onClick={() => setPage(Page.StaveLabels)}
                    >
                        Numbering
                    </MenuItem>
                </div>

                <div className="generic-settings__right-panel">
                    {page === Page.StaveLabels && (
                        <>
                            <div
                                className="generic-settings__section"
                                style={{ paddingBottom: 20 }}
                            >
                                <Subheader>instrument numbering style</Subheader>
                                <Select
                                    margin
                                    label="Solo players"
                                    value={config.auto_count_style.solo}
                                    onChange={(val: InstrumentAutoCountStyle) =>
                                        actions.score.config.auto_count_style.solo(val)
                                    }
                                >
                                    <Option
                                        value={InstrumentAutoCountStyle.Arabic}
                                        displayAs="Arabic"
                                    >
                                        <Label>
                                            <p>Arabic</p>
                                            <p>1, 2, 3...</p>
                                        </Label>
                                    </Option>
                                    <Option
                                        value={InstrumentAutoCountStyle.Roman}
                                        displayAs="Roman"
                                    >
                                        <Label>
                                            <p>Roman</p>
                                            <p>I, II, III...</p>
                                        </Label>
                                    </Option>
                                </Select>
                                <Select
                                    label="Section players"
                                    value={config.auto_count_style.section}
                                    onChange={(val: InstrumentAutoCountStyle) =>
                                        actions.score.config.auto_count_style.section(val)
                                    }
                                >
                                    <Option
                                        value={InstrumentAutoCountStyle.Arabic}
                                        displayAs="Arabic"
                                    >
                                        <Label>
                                            <p>Arabic</p>
                                            <p>1, 2, 3...</p>
                                        </Label>
                                    </Option>
                                    <Option
                                        value={InstrumentAutoCountStyle.Roman}
                                        displayAs="Roman"
                                    >
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
                <Button compact outline>
                    Reset All
                </Button>
                <div className="generic-settings__spacer" />
                <Button compact onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
});
