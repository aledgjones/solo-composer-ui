import React, { FC, useCallback, KeyboardEvent } from "react";
import { merge } from "../../../ui";

import "./styles.css";

interface Props {
    percent: number;
    onChange: (value: number) => void;
}

export const Fader: FC<Props> = ({ percent, onChange }) => {
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

    return (
        <div className="fader">
            <div className="fader__track">
                <button className="fader__handle" onKeyDown={keyPress} style={{ left: `${percent}%` }} />
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
