import { FC } from "react";
import { actions } from "../../store/actions";
import { NoteDuration } from "../../store/entries/defs";
import { useStore } from "../../store/use-store";
import { Option, Select } from "../../ui";
import "./styles.css";

export const Snap: FC = () => {
  const snap_duration = useStore((s) => s.ui.snap);

  return (
    <div className="snap">
      <Select className="snap__select" direction="up" value={snap_duration} onChange={(val) => actions.ui.snap(val)}>
        <Option value={NoteDuration.Eighth} displayAs={"\u{E1D7}"}>
          {"\u{E1D7}"}
        </Option>
        <Option value={NoteDuration.Sixteenth} displayAs={"\u{E1D9}"}>
          {"\u{E1D9}"}
        </Option>
        <Option value={NoteDuration.ThirtySecond} displayAs={"\u{E1DB}"}>
          {"\u{E1DB}"}
        </Option>
      </Select>
    </div>
  );
};
