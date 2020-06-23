import React, { FC } from "react";

import "./styles.css";

interface Props {
    percent: number;
}

export const Meter: FC<Props> = ({ percent }) => {
    return (
        <div className="meter">
            <div className="meter__track">
                <div className="meter__track-fill" style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
};
