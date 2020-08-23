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
    const instructions = parse(score, flow_key, mm);
    if (taskID === latestTaskID) {
        ctx.postMessage(instructions);
    }
});

export default null as any;
