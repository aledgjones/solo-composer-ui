import React, { FC, useCallback, KeyboardEvent, useRef } from "react";
import { merge, useDragHandler, Input } from "../../../ui";

import "./styles.css";

interface Props {
    percent: number;
    onChange: (value: number) => void;
}

export const Fader: FC<Props> = ({ percent, onChange }) => {
    const ref = useRef<HTMLDivElement>(null);
    const keyPress = useCallback(
        (e: KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "ArrowLeft") {
                percent - 1 < 0 ? onChange(0) : onChange(percent - 1);
            }
            if (e.key === "ArrowRight") {
                percent + 1 > 100 ? onChange(100) : onChange(percent + 1);
            }
        },
        [percent, onChange]
    );

    const pointerDown = useDragHandler<{ width: number; left: number }>(
        {
            onDown: () => {
                if (!ref.current) {
                    return false;
                }

                const box = ref.current.getBoundingClientRect();
                return { width: box.width, left: box.left };
            },
            onMove: (e, data) => {
                const offset = e.clientX - data.left;
                if (offset < 0) {
                    onChange(0);
                } else if (offset > data.width) {
                    onChange(100);
                } else {
                    const next = (offset / data.width) * 100;
                    onChange(next);
                }
            },
            onEnd: () => {}
        },
        [ref]
    );

    return (
        <div className="fader">
            <div className="fader__track" ref={ref}>
                <button
                    className="fader__handle"
                    onPointerDown={pointerDown}
                    onKeyDown={keyPress}
                    style={{ left: `${percent}%` }}
                />
            </div>
            {Array(11)
                .fill(null)
                .map((val, i) => {
                    return (
                        <div
                            key={i}
                            className={merge("fader__scale", { "fader__scale--tall": i % 5 === 0 })}
                            style={{ left: `${i * 10}%` }}
                        />
                    );
                })}
        </div>
    );
};
