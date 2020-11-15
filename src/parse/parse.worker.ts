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

    performance.mark("start");
    const instructions = parse(score, flow_key, mm);
    performance.measure("parse", "start");

    const entries = performance.getEntriesByType("measure");
    const duration = entries[entries.length - 1].duration;
    const average =
        entries.reduce<number>((out, entry) => {
            return out + entry.duration;
        }, 0) / entries.length;
    console.log(
        `duration: %c${duration}`,
        (duration < 1000 / 60 && "color: green") || (duration < 1000 / 30 && "color: orange") || "color: red"
    );
    console.log(
        `average: %c${average}`,
        (average < 1000 / 60 && "color: green") || (average < 1000 / 30 && "color: orange") || "color: red"
    );

    if (taskID === latestTaskID) {
        ctx.postMessage(instructions);
    }
});

export default null as any;
