import React, { FC } from "react";
import { mdiPlus } from "@mdi/js";
import { Icon, SortableContainer } from "../../../ui";
import { useStore, actions } from "../../../store";
import { FlowItem } from "../flow-item";
import { Selection, SelectionType } from "../selection";

import "./styles.css";

interface Props {
    selection: Selection;
    onSelect: (selection: Selection) => void;
}

export const FlowList: FC<Props> = ({ selection, onSelect }) => {
    const flows = useStore((s) => {
        return s.score.flows.order.map((key) => {
            return s.score.flows.by_key[key];
        });
    });
    const width = `calc(${100 / flows.length}% - 8px)`;

    return (
        <div className="flow-list">
            <div className="flow-list__header">
                <span>Flows</span>
                <Icon
                    size={24}
                    path={mdiPlus}
                    onClick={() => {
                        const key = actions.score.flow.create();
                        onSelect({ key, type: SelectionType.Flow });
                    }}
                />
            </div>
            <div className="flow-list__wrapper">
                <SortableContainer direction="x" className="flow-list__content" onEnd={actions.score.flow.reorder}>
                    {flows.map((flow, i) => (
                        <FlowItem
                            index={i}
                            key={flow.key}
                            flow={flow}
                            selection={selection}
                            onSelect={onSelect}
                            style={{ width }}
                        />
                    ))}
                </SortableContainer>
            </div>
        </div>
    );
};
