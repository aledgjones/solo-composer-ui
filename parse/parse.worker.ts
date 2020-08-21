import shortid from "shortid";
import { Score } from "../store/defs";
import { RenderInstructions } from "../src/render/instructions";

const ctx = (self as unknown) as Worker; // eslint-disable-line

let latestTaskID = shortid();

ctx.addEventListener("message", async (e: any) => {
    // greet();
    const mm: number = e.data.mm;
    const score: Score = e.data.score;
    const flow_key: string = e.data.flow_key;

    console.log(mm, score, flow_key);

    const taskID = shortid();
    latestTaskID = taskID;
    const instructions: RenderInstructions = {
        space: 1,
        width: 400,
        height: 200,
        entries: [],
    };
    // const instructions = parse(score, flow_key, mm);
    if (taskID === latestTaskID) {
        ctx.postMessage(instructions);
    }
});

export default null as any;
