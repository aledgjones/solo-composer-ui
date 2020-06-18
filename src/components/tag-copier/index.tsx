import React, { FC, useState, useCallback } from "react";
import { mdiTagOutline, mdiCheck } from "@mdi/js";
import { Icon, copy } from "../../../ui";

interface Props {
    content: string;
}

export const TagCopier: FC<Props> = ({ content }) => {
    const [working, setWorking] = useState(false);
    const trigger = useCallback(() => {
        copy(content);
        setWorking(true);
        setTimeout(() => setWorking(false), 1000);
    }, [content]);

    if (working) {
        return <Icon style={{ color: "var(--primary-bg" }} size={16} path={mdiCheck} />;
    } else {
        return <Icon size={16} path={mdiTagOutline} onClick={trigger} />;
    }
};
