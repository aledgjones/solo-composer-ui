import { useMemo } from "react";
import { parse } from "../../parse";
import { Score } from "../../store/score/defs";
import { useMM } from "./use-mm";

export function useParseWorker(score: Score, flow_key: string, debug: boolean) {
  if (process.env.NODE_ENV === "development" || debug) {
    performance.mark("start");
  }

  const mm = useMM();
  const instructions = useMemo(() => parse(score, flow_key, mm, debug), [score, flow_key, mm, debug]);

  if (process.env.NODE_ENV === "development" || debug) {
    performance.measure("parse", "start");

    const entries = performance.getEntriesByType("measure");
    const duration = entries[entries.length - 1].duration;
    console.log(
      `duration: %c${duration}`,
      (duration < 1000 / 60 && "color: green") || (duration < 1000 / 30 && "color: orange") || "color: red"
    );
  }

  return instructions;
}
