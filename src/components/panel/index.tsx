import React, { FC } from "react";
import { merge } from "../../ui";

import "./styles.css";

interface Props {
    className?: string;
}

export const Panel: FC<Props> = ({ className, children }) => {
    return <div className={merge("panel", className)}>{children}</div>;
};
