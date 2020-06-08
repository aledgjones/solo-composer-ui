import React, { FC, useMemo } from "react";
import { mdiPlus } from "@mdi/js";
import { Icon, SortableContainer } from "../../ui";
import { useActions, useStore } from "../../use-store";
import { FlowItem } from "../flow-item";
import { Selection, SelectionType } from "../selection";

import "./styles.css";

interface Props {
    selection: Selection;
    onSelect: (selection: Selection) => void;
}

export const FlowList: FC<Props> = ({ selection, onSelect }) => {
    const actions = useActions();
    const flows = useStore((s) =>
        s.score.flows.order.map((key) => {
            return s.score.flows.by_key[key];
        })
    );

    const width = useMemo(() => {
        return `calc(${100 / flows.length}% - 8px)`;
    }, [flows.length]);

    return (
        <div className="flow-list">
            <div className="flow-list__header">
                <span>Flows</span>
                <Icon
                    size={24}
                    path={mdiPlus}
                    onClick={() => {
                        const key = actions.score.flow.create();
                        onSelect({ key, type: SelectionType.flow });
                    }}
                />
            </div>
            <div className="flow-list__wrapper">
                <SortableContainer
                    direction="x"
                    className="flow-list__content"
                    onEnd={actions.score.flow.reorder}
                >
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
