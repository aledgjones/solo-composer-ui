import React, { FC } from "react";

import "./styles.css";

interface Props {
    percent: number;
    color: string;
}

export const Meter: FC<Props> = ({ percent, color }) => {
    return (
        <div className="meter">
            <div className="meter__track">
                <div className="meter__track-fill" style={{ width: `${percent}%`, backgroundColor: color }} />
            </div>
        </div>
    );
};
