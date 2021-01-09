import { FC } from "react";
import { DragScroll, merge } from "../../ui";

import "./styles.css";

interface Props {
  className?: string;
}

export const RenderRegion: FC<Props> = ({ children, className }) => {
  return (
    <DragScroll ignore="no-scroll" x y className={merge("render-region", className)}>
      {children}
    </DragScroll>
  );
};
