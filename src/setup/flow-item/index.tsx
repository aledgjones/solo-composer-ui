import React, {
    useCallback,
    useMemo,
    MouseEvent,
    FC,
    useRef,
    CSSProperties,
    useState
} from "react";
import { mdiDeleteOutline, mdiFileDocumentOutline, mdiPencilOutline } from "@mdi/js";
import { SortableItem, merge, Icon } from "../../ui";
import { Flow, useActions } from "../../use-store";
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
    const actions = useActions();

    const [editing, setEditing] = useState(false);

    const selected: boolean = useMemo(() => {
        return !!selection && selection.key === flow.key;
    }, [selection, flow.key]);

    const active: boolean = useMemo(() => {
        return (
            !!selection &&
            selection.type === SelectionType.player &&
            flow.players.includes(selection.key)
        );
    }, [selection, flow.players]);

    const onSelectFlow = useCallback(() => {
        onSelect({ key: flow.key, type: SelectionType.flow });
    }, [flow.key, onSelect]);

    const onCheckboxChange = useCallback(
        (value: boolean) => {
            if (selection) {
                const playerKey = selection.key;
                if (value) {
                    console.log("Player Assigned: " + playerKey);
                    // actions.score.flows.assignPlayer(flow.key, playerKey);
                } else {
                    console.log("Player Removed: " + playerKey);
                    // actions.score.flows.removePlayer(flow.key, playerKey);
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
            onClick={onSelectFlow}
        >
            <div className="flow-item__header">
                <div onPointerDown={onSelectFlow} ref={handle}>
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

                {/* {!!selection && selection.type !== SelectionType.flow && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox color="white" value={active} onChange={onCheckboxChange} />
                    </div>
                )} */}
            </div>
        </SortableItem>
    );
};
