import { FC, CSSProperties } from "react";
import { Spinner } from "../../../ui";

import "./styles.css";

interface Props {
  style?: CSSProperties;
}

export const Loading: FC<Props> = ({ style }) => {
  return (
    <div className="loading" style={style}>
      <Spinner color="var(--foreground-500)" size={24} />
    </div>
  );
};
