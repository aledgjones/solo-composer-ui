import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";

import "./styles.css";

interface Props {
  icon: string;
  onCommand: (value: string) => void;
  onHide: () => void;
}

export const Popover: FC<Props> = ({ icon, onCommand, onHide }) => {
  const input = useRef<HTMLInputElement>();
  const [value, setValue] = useState("");

  useLayoutEffect(() => {
    setTimeout(() => {
      if (input.current) {
        setValue("");
        input.current.focus();
      }
    }, 0);
  }, [input]);

  const onKeyDown = (e: any) => {
    if (e.key === "Enter") {
      onCommand(e.target.value);
      onHide();
    }
    if (e.key === "Escape") {
      onHide();
    }
  };

  return (
    <div className="popover no-scroll">
      <p className="popover__icon">{icon}</p>
      <input
        ref={input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onHide}
        className="popover__input"
      />
    </div>
  );
};
