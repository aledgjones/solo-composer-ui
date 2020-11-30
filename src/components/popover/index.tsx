import { FC, useState } from "react";
import { useStore } from "../../store/use-store";
import { popoverAction } from "./commands";

import "./styles.css";

export const Popover: FC = () => {
  const [type, flowKey] = useStore((s) => {
    const flowKey = s.ui.flow_key || s.score.flows.order[0];
    return [s.ui.write.popover, flowKey];
  });
  const [value, setValue] = useState("");

  const onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      popoverAction(type, flowKey, 0, e.target.value);
      setValue("");
    }
  };

  const icon = "\u{E262}";

  if (type === null) {
    return null;
  } else {
    return (
      <div className="popover no-scroll">
        <p className="popover__icon">{icon}</p>
        <input
          value={value}
          onKeyPress={onKeyPress}
          onChange={(e) => setValue(e.target.value)}
          className="popover__input"
        />
      </div>
    );
  }
};
