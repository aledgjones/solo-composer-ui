import shortid from "shortid";
import { Tick } from "./generic";

export abstract class Entry {
    public key: string;
    public tick: Tick;

    constructor(tick: Tick, key: string = shortid()) {
        this.key = key;
        this.tick = tick;
    }
}
