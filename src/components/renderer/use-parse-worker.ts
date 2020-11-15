import { useEffect, useState } from "react";
import { RenderInstructions } from "../../render/instructions";
import { Score } from "../../store/score/defs";
import { useMM } from "./use-mm";

const worker = new Worker("../../parse/parse.worker.ts");
let cache: RenderInstructions;

export function useParseWorker(score: Score, flow_key: string) {
    const [instructions, setInstructions] = useState<RenderInstructions | undefined>(cache);

    const mm = useMM();

    useEffect(() => {
        worker.postMessage({ mm, score, flow_key });
    }, [mm, score, flow_key]);

    useEffect(() => {
        const cb = (e: any) => {
            cache = e.data;
            setInstructions(e.data);
        };

        worker.addEventListener("message", cb);
        return () => {
            worker.removeEventListener("message", cb);
            // worker.terminate();
        };
    }, []);

    return instructions;
}
