import { FC } from "react";
import { useDragHandler } from "../../../ui";
import { Slots } from "./slots";
import { SLOT_HEIGHT } from "../const";
import { useStore } from "../../store/use-store";
import { actions } from "../../store/actions";

import "./styles.css";

interface Props {
  instrumentKey: string;
  height: number;
}

export const Keyboard: FC<Props> = ({ instrumentKey, height }) => {
  const base = useStore(
    (s) => {
      const keyboard = s.ui.play.keyboard[instrumentKey];
      return keyboard || 76;
    },
    [instrumentKey]
  );

  const onDrag = useDragHandler<{ y: number; base: number }>(
    {
      onDown: (e) => {
        return {
          y: e.screenY,
          base,
        };
      },
      onMove: (e, init) => {
        const change = Math.round((init.y - e.screenY) / SLOT_HEIGHT);
        const next = init.base - change;
        // E8 <= next >= E1
        if (next <= 112 && next >= 28) {
          actions.ui.play.keyboard(instrumentKey, init.base - change);
        }
      },
      onEnd: () => {},
    },
    [base, instrumentKey]
  );

  return (
    <div className="keyboard" onPointerDown={onDrag} style={{ height: height * SLOT_HEIGHT }}>
      <Slots base={base} count={height} isKeyboard={true} />
    </div>
  );
};
