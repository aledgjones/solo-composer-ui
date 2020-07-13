import { useMemo, useState, useEffect } from "react";
import { Transport } from "tone";
import { samplers } from ".";

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
