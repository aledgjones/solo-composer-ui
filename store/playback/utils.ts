import { useMemo, useState, useEffect } from "react";
import { Transport, ToneAudioNode } from "tone";
import { samplers } from ".";

export function chain(...nodes: ToneAudioNode[]) {
    const len = nodes.length;
    nodes.forEach((node, i) => {
        if (i < len - 1) {
            node.connect(nodes[i + 1]);
        } else {
            node.toDestination();
        }
    });
}

export function useSampler(instrumentKey: string) {
    return useMemo(() => {
        return samplers[instrumentKey];
    }, [instrumentKey]);
}

export function useTick() {
    const [timestamp, setTimestamp] = useState(0);
    useEffect(() => {
        let running = true;
        const update = () => {
            const stamp = parseInt(Transport.ticks.toString());
            setTimestamp(stamp);
            if (running) {
                requestAnimationFrame(update);
            }
        };

        update();

        return () => {
            running = false;
        };
    }, []);
    return timestamp;
}

export function useWaveform(instrumentKey: string) {
    const [amplitude, setAmplitude] = useState(0);
    useEffect(() => {
        const node = samplers[instrumentKey].analyserNode;
        let running = true;
        const update = () => {
            const value = ((node.getValue() as number) * 100).toFixed(0);
            setAmplitude(parseInt(value));
            if (running) {
                requestAnimationFrame(update);
            }
        };

        update();

        return () => {
            running = false;
        };
    }, [instrumentKey]);
    return amplitude;
}
