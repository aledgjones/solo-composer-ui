import React, { FC, CSSProperties } from "react";
import { Spinner } from "../../ui";
import { Panel } from "../panel";

import "./styles.css";

interface Props {
    style?: CSSProperties;
}

export const Loading: FC<Props> = ({ style }) => {
    return (
        <div
            className="fallback"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                paddingLeft: 64,
                ...style
            }}
        >
            <Panel />
            <Spinner color="var(--background-500-fg)" size={24} />
        </div>
    );
};
