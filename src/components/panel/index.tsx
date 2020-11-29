import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { FC } from "react";
import { Icon, merge } from "../../../ui";

import "./styles.css";

export enum CollpaseDirection {
  None,
  Left,
  Right,
}

interface Props {
  collapsed?: boolean;
  collapse?: CollpaseDirection;
  onToggle?: () => void;
  className: string;
}

export const Panel: FC<Props> = ({
  children,
  className,
  collapse,
  collapsed,
  onToggle,
}) => {
  return (
    <div className={merge("panel", className)}>
      {collapse === CollpaseDirection.Left && (
        <div
          className="panel__collapse panel__collapse--left"
          onClick={onToggle}
        >
          <Icon
            style={{
              transform: `rotateZ(${collapsed ? 0 : 180}deg)`,
            }}
            path={mdiChevronLeft}
            size={12}
          />
        </div>
      )}
      {!collapsed && <div className="panel__content">{children}</div>}
      {collapse === CollpaseDirection.Right && (
        <div
          className="panel__collapse panel__collapse--left"
          onClick={onToggle}
        >
          <Icon
            style={{
              transform: `rotateZ(${collapsed ? 0 : 180}deg)`,
            }}
            path={mdiChevronRight}
            size={12}
          />
        </div>
      )}
    </div>
  );
};
