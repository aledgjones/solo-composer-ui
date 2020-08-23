import { useMemo, useEffect, useState } from "react";
import { RenderInstructions } from "../../render/instructions";
import { Score } from "../../store/score/defs";
import { useMM } from "./use-mm";
import myWorker from "../../parse/parse.worker";

export function useParseWorker(score: Score, flow_key: string) {
    const [instructions, setInstructions] = useState<RenderInstructions>();

    const worker = useMemo(() => {
        return new myWorker() as Worker;
    }, []);

    const mm = useMM();

    useEffect(() => {
        worker.postMessage({ mm, score, flow_key });
    }, [mm, worker, score, flow_key]);

    useEffect(() => {
        const cb = (e: any) => {
            setInstructions(e.data);
        };

        worker.addEventListener("message", cb);
        return () => {
            worker.removeEventListener("message", cb);
            worker.terminate();
        };
    }, [worker]);

    return instructions;
}
