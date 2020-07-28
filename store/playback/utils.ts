import { useState, useEffect } from "react";
import { Transport, Tick, Player } from "solo-composer-scheduler";

export function useTick() {
    const [timestamp, setTimestamp] = useState(0);
    useEffect(() => {
        const cb = (tick: Tick) => setTimestamp(tick);
        Transport.on("tick", cb);

        return () => {
            Transport.removeListener("tick", cb);
        };
    }, []);
    return timestamp;
}

export function useWaveform(instrumentKey: string) {
    const [amplitude, setAmplitude] = useState(0);
    useEffect(() => {
        let running = true;
        const update = () => {
            setAmplitude(Player.RMS(instrumentKey));
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
