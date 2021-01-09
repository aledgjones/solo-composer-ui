import { MouseEvent, FC, useRef, CSSProperties, useState } from "react";
import { mdiDeleteOutline, mdiFileDocumentOutline, mdiPencilOutline } from "@mdi/js";
import { SortableItem, merge, Icon, Checkbox } from "../../../ui";
import { Selection, SelectionType } from "../selection";
import { Flow } from "../../../store/score-flow/defs";
import { actions } from "../../../store/actions";

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

  const [savedValue, setSavedValue] = useState(flow.title);
  const [editing, setEditing] = useState(false);
  const selected = selection && selection.key === flow.key;
  const active: boolean = selection && selection.type === SelectionType.Player && flow.players[selection.key];

  const onCheckboxChange = (value: boolean) => {
    if (selection) {
      const playerKey = selection.key;
      if (value) {
        actions.score.flow.assign_player(flow.key, playerKey);
      } else {
        actions.score.flow.unassign_player(flow.key, playerKey);
      }
    }
  };

  const onRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    actions.score.flow.remove(flow.key);
    onSelect(null);
  };

  const onEdit = () => {
    if (input.current) {
      setSavedValue(flow.title);
      input.current.focus();
    }
    setEditing(true);
  };

  const onKeyDown = (e: any) => {
    switch (e.key) {
      case "Enter":
        // confirm
        if (input.current) {
          input.current.blur();
        }
        break;
      case "Escape":
        // revert
        actions.score.flow.rename(flow.key, savedValue);
        input.current.blur();
        break;
      default:
        break;
    }
  };

  return (
    <SortableItem
      index={index}
      handle={handle}
      className={merge("flow-item", {
        "flow-item--editing": editing,
        "flow-item--selected": selected,
        "flow-item--active": active,
      })}
      style={style}
      onClick={() => onSelect({ key: flow.key, type: SelectionType.Flow })}
    >
      <div className="flow-item__header">
        <div onPointerDown={() => onSelect({ key: flow.key, type: SelectionType.Flow })} ref={handle}>
          <Icon style={{ marginRight: 12 }} path={mdiFileDocumentOutline} size={24} />
        </div>

        <input
          ref={input}
          style={{ fontStyle: !editing && !flow.title && "italic" }}
          onBlur={() => setEditing(false)}
          readOnly={!editing}
          className="flow-item__name"
          tabIndex={editing ? 0 : -1}
          value={editing ? flow.title : flow.title || "Untitled Flow"}
          onKeyDown={onKeyDown}
          onInput={(e: any) => actions.score.flow.rename(flow.key, e.target.value)}
        />

        {selected && (
          <>
            <Icon style={{ marginLeft: 12 }} size={24} path={mdiPencilOutline} onClick={onEdit} />
            <Icon style={{ marginLeft: 12 }} size={24} path={mdiDeleteOutline} onClick={onRemove} />
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
