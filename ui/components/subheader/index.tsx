import React, { FC, CSSProperties } from "react";

import { merge } from "../../utils/merge";

import "./styles.css";

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;
    compact?: boolean;
}

/**
 * Google tasks style subheader component. Small, bold and capitalized.
 */
export const Subheader: FC<Props> = ({ id, className, style, compact, children }) => {
    return (
        <p id={id} className={merge("ui-subheader", { "ui-subheader--compact": compact }, className)} style={style}>
            {children}
        </p>
    );
};
