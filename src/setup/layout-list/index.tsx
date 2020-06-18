import React, { FC } from "react";
import { mdiPlus } from "@mdi/js";
import { Icon } from "../../../ui";

import "./styles.css";

interface Props {}

export const LayoutList: FC<Props> = () => {
    return (
        <div className="layout-list">
            <div className="layout-list__header">
                <span className="layout-list__label">Layouts</span>
                <Icon disabled size={24} path={mdiPlus} onClick={() => {}} />
            </div>
        </div>
    );
};
