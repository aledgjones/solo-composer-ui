import React, { FC } from "react";
import { DragScroll, merge } from "../../../ui";

import "./styles.css";

interface Props {
    className?: string;
}

export const RenderRegion: FC<Props> = ({ children, className }) => {
    return (
        <DragScroll x y className={merge("render-region", className)}>
            {children}
        </DragScroll>
    );
};
