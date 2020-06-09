import React, { FC, CSSProperties } from "react";
import { mdiEyeOffOutline } from "@mdi/js";
import { Icon, Label } from "../../ui";

import "./styles.css";

interface Props {
    text?: string;
    subtext?: string;
    style?: CSSProperties;
}

export const Empty: FC<Props> = ({ text, subtext, style }) => {
    return (
        <div className="empty" style={style}>
            <Icon className="empty__icon" path={mdiEyeOffOutline} size={48} />
            <Label className="empty__label">
                <p>{text || "Nothing to see here"}</p>
                <p>{subtext || "I haven't done this bit yet... shucks!"}</p>
            </Label>
        </div>
    );
};
