import { useMemo, useState, useEffect } from "react";
import { Transport } from "tone";
import { samplers } from ".";

export function useSampler(instrumentKey: string) {
    return useMemo(() => {
        return samplers[instrumentKey];
    }, [instrumentKey]);
}

export function useTimestamp() {
    const [timestamp, setTimestamp] = useState("1.1.000");
    useEffect(() => {
        let running = true;
        const update = () => {
            const stamp = Transport.position.toString();
            const [bar_str, beat_str, sixteenth_complete_str] = stamp.split(":");
            const [sixteenth_str, decimal_str] = sixteenth_complete_str.split(".");

            const bar = parseInt(bar_str) + 1;
            const beat = parseInt(beat_str) + 1;
            const sixteenth = parseInt(sixteenth_str) + 1;
            const decimal = decimal_str ? decimal_str.padStart(3, "0") : "000";

            setTimestamp(`${bar}:${beat}:${sixteenth}.${decimal}`);

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
