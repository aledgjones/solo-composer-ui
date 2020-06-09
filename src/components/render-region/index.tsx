import React, { FC } from "react";
import { DragScroll, merge } from "../../ui";

import "./styles.css";

import bg from "./background.png";

interface Props {
    className?: string;
}

export const RenderRegion: FC<Props> = ({ children, className }) => {
    return (
        <DragScroll
            x
            y
            className={merge("render-region", className)}
            style={{ backgroundImage: `url(${bg})` }}
        >
            {children}
        </DragScroll>
    );
};
