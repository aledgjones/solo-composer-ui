import { Sampler } from "tone";

interface PatchFromFile {
    envelope: {
        attack: number;
        release: number;
    };
    samples: {
        [note: string]: string;
    };
}

export class PatchPlayer {
    public id: string;
    public url: string;
    public sampler = new Sampler().toDestination();

    constructor(id: string, url: string) {
        this.load(id, url);
    }

    /**
     * Load Patches from patch def
     */
    public async load(id: string, url: string) {
        this.id = id;
        this.url = url;

        const resp = await fetch(url);
        const data: PatchFromFile = await resp.json();

        const pitches = Object.keys(data.samples);
        this.sampler.attack = data.envelope.attack;
        this.sampler.release = data.envelope.release;

        for (let i = 0; i < pitches.length; i++) {
            const pitch = pitches[i] as any;
            await new Promise((resolve) => {
                this.sampler.add(pitch, data.samples[pitches[i]], resolve);
            });
        }
    }

    /**
     * Play a patch
     */
    public play(pitch: string, velocity: number, duration: number) {
        this.sampler.triggerAttackRelease(pitch, duration, undefined, velocity);
    }

    /**
     * Stop all patches playing
     */
    public stopAll() {
        this.sampler.releaseAll();
    }

    public drop() {
        this.sampler.dispose();
    }
}
