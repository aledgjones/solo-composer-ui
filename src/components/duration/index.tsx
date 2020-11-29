import { FC, useState, useEffect, useCallback } from "react";
import duration from "humanize-duration";

interface Props {
  when: number;
}

export const Duration: FC<Props> = ({ when }) => {
  const cb = useCallback(() => {
    const calc = Date.now() - when;
    if (calc < 30 * 1000) {
      return "just now";
    } else {
      const str = duration(calc, { largest: 1, round: true });
      return str + " ago";
    }
  }, [when]);

  const [display, setDisplay] = useState(cb());

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay(cb());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [cb]);

  return <span>{display}</span>;
};
