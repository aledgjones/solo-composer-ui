import React, { FC } from "react";
import { useDragHandler } from "../../../ui";
import { Keys } from "./keys";
import { SLOT_HEIGHT } from "../const";
import { useStore, actions } from "../../../store";

import "./styles.css";

interface Props {
    instrumentKey: string;
    height: number;
}

export const Keyboard: FC<Props> = ({ instrumentKey, height }) => {
    const base = useStore((s) => s.ui.keyboard[instrumentKey] || 76, [instrumentKey]);

    const onDrag = useDragHandler<{ y: number; base: number }>(
        {
            onDown: (e) => {
                return {
                    y: e.screenY,
                    base
                };
            },
            onMove: (e, init) => {
                const change = Math.round((init.y - e.screenY) / SLOT_HEIGHT);
                const next = init.base - change;
                // E8 <= next >= E1
                if (next <= 112 && next >= 28) {
                    actions.ui.keyboard(instrumentKey, init.base - change);
                }
            },
            onEnd: () => {}
        },
        [base, instrumentKey]
    );

    return (
        <div className="keyboard" onPointerDown={onDrag} style={{ height: height * SLOT_HEIGHT }}>
            <Keys base={base} height={height} />
        </div>
    );
};
