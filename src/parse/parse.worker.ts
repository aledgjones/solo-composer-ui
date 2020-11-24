import shortid from "shortid";
import { parse } from "./index";

const ctx = (self as unknown) as Worker; // eslint-disable-line

let latestTaskID = shortid();

interface Data {
  mm: number;
  score: any;
  flow_key: string;
}

ctx.addEventListener("message", (e) => {
  const { mm, score, flow_key } = e.data as Data;
  const taskID = shortid();
  latestTaskID = taskID;

  if (process.env.NODE_ENV === "development") {
    performance.mark("start");
  }

  const instructions = parse(score, flow_key, mm);

  if (process.env.NODE_ENV === "development") {
    performance.measure("parse", "start");

    const entries = performance.getEntriesByType("measure");
    const duration = entries[entries.length - 1].duration;
    console.log(
      `duration: %c${duration}`,
      (duration < 1000 / 60 && "color: green") ||
        (duration < 1000 / 30 && "color: orange") ||
        "color: red"
    );
  }

  if (taskID === latestTaskID) {
    ctx.postMessage(instructions);
  }
});

export default null as any;
