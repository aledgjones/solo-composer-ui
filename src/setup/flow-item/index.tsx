import React, { useCallback, MouseEvent, FC, useRef, CSSProperties, useState } from "react";
import { mdiDeleteOutline, mdiFileDocumentOutline, mdiPencilOutline } from "@mdi/js";
import { SortableItem, merge, Icon, Checkbox } from "../../ui";
import { actions, Flow } from "../../../store";
import { Selection, SelectionType } from "../selection";

import "./styles.css";

interface Props {
    index: number;
    flow: Flow;
    selection: Selection;
    style: CSSProperties;

    onSelect: (selection: Selection) => void;
}

export const FlowItem: FC<Props> = ({ index, flow, selection, style, onSelect }) => {
    const handle = useRef<HTMLDivElement>(null);
    const input = useRef<HTMLInputElement>(null);

    const [editing, setEditing] = useState(false);
    const selected = selection && selection.key === flow.key;
    const active: boolean =
        selection &&
        selection.type === SelectionType.Player &&
        flow.players.includes(selection.key);

    const onCheckboxChange = useCallback(
        (value: boolean) => {
            if (selection) {
                const playerKey = selection.key;
                if (value) {
                    actions.score.flow.assign_player(flow.key, playerKey);
                } else {
                    actions.score.flow.unassign_player(flow.key, playerKey);
                }
            }
        },
        [selection, flow.key, actions.score.flow]
    );

    const onRemove = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            actions.score.flow.remove(flow.key);
            onSelect(null);
        },
        [onSelect, actions.score.flow, flow.key]
    );

    const onEdit = useCallback(() => {
        if (input.current) {
            input.current.focus();
        }
        setEditing(true);
    }, [input]);

    const onBlur = useCallback(() => {
        setEditing(false);
        if (!flow.title) {
            actions.score.flow.rename(flow.key, "Untitled Flow");
        }
    }, [flow.title, actions.score.flow, flow.key]);

    return (
        <SortableItem
            index={index}
            handle={handle}
            className={merge("flow-item", {
                "flow-item--editing": editing,
                "flow-item--selected": selected,
                "flow-item--active": active
            })}
            style={style}
            onClick={() => onSelect({ key: flow.key, type: SelectionType.Flow })}
        >
            <div className="flow-item__header">
                <div
                    onPointerDown={() => onSelect({ key: flow.key, type: SelectionType.Flow })}
                    ref={handle}
                >
                    <Icon style={{ marginRight: 12 }} path={mdiFileDocumentOutline} size={24} />
                </div>

                <input
                    ref={input}
                    onBlur={onBlur}
                    readOnly={!editing}
                    className="flow-item__name"
                    value={flow.title}
                    onInput={(e: any) => actions.score.flow.rename(flow.key, e.target.value)}
                />

                {selected && (
                    <>
                        <Icon
                            style={{ marginLeft: 12 }}
                            size={24}
                            path={mdiPencilOutline}
                            onClick={onEdit}
                        />
                        <Icon
                            style={{ marginLeft: 12 }}
                            size={24}
                            path={mdiDeleteOutline}
                            onClick={onRemove}
                        />
                    </>
                )}

                {selection && selection.type !== SelectionType.Flow && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox value={active} onChange={onCheckboxChange} />
                    </div>
                )}
            </div>
        </SortableItem>
    );
};
