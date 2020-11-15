import React, { FC, useState, useCallback } from "react";
import { mdiTagOutline, mdiCheck } from "@mdi/js";
import { Icon, copy, merge } from "../../../ui";

import "./styles.css";

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

  return (
    <span
      className={merge("tag-copier", { "tag-copier--working": working })}
      data-tooltip={content}
      data-tooltip-direction="down"
    >
      <Icon
        size={16}
        path={working ? mdiCheck : mdiTagOutline}
        onClick={trigger}
      />
    </span>
  );
};
