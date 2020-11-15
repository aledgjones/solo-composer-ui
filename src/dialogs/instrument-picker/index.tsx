import React, { useState } from "react";
import { mdiChevronRight } from "@mdi/js";
import { Dialog, Icon, Button } from "../../../ui";
import { MenuItem } from "../../components/menu-item";
import { Text } from "../../components/text";
import { get_full_path_from_partial } from "../../store/score-instrument/utils";
import { useDefsList } from "../../store/score-instrument/hooks";

import "../generic-settings.css";
import "./styles.css";

interface Props {
    onSelect: (id: string) => void;
    onCancel: () => void;
}

export const InstrumentPicker = Dialog<Props>(({ onSelect, onCancel }) => {
    const [selection, setSelection] = useState<{ path: string[]; id: string }>(() => {
        return get_full_path_from_partial([]);
    });
    const lists = useDefsList(selection.path);

    return (
        <div className="instrument-picker">
            <div className="instrument-picker__sections">
                {lists.map((list, i) => {
                    return (
                        <div key={i} className="instrument-picker__section">
                            {list.map((item) => {
                                const selected = item === selection.path[i];
                                const final = !(selected && lists[i + 1] && lists[i + 1].length > 0);

                                return (
                                    <MenuItem
                                        key={item}
                                        selected={selected}
                                        onClick={() => {
                                            // only alow fresh selection else it will revert to first
                                            if (!selected) {
                                                const path = [...selection.path.slice(0, i), item];
                                                const def = get_full_path_from_partial(path);
                                                setSelection(def);
                                            }
                                        }}
                                    >
                                        <span>
                                            <Text content={item} />
                                        </span>
                                        {!final && <Icon size={24} path={mdiChevronRight} />}
                                    </MenuItem>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            <div className="instrument-picker__buttons">
                <div className="instrument-picker__spacer" />
                <Button compact outline style={{ marginRight: 8 }} onClick={onCancel}>
                    Cancel
                </Button>
                <Button compact onClick={() => onSelect(selection.id)}>
                    Add
                </Button>
            </div>
        </div>
    );
});
