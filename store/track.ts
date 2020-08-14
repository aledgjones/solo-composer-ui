import shortid from "shortid";
import { Entry } from "./entry";
import { Tick } from "./generic";

export class Entries {
    by_tick: { [tick: string]: string[] };
    by_key: { [key: string]: Entry }; // The typing stop here we will never actually use these js side.

    public insert(entry: Entry) {
        const tick = this.by_tick[entry.tick.toString()] || [];
        tick.push(entry.key);
        this.by_key[entry.key] = entry;
    }

    /// Move an entry to a new tick
    public move(key: string, new_tick: Tick) {
        let entry = this.by_key[key];
        let old_tick = entry.tick;

        // move the entry tp the new tick only if it has actually moved
        if (old_tick != new_tick) {
            // update the entry itself
            entry.tick = new_tick;
            // move the entry key to the new tick
            this.by_tick[old_tick].filter((k) => k !== key);
            let tick = this.by_tick[new_tick] || [];
            tick.push(key);
        }
    }

    /// remove an entry and return the removed entry
    public remove(key: string): Entry {
        let entry = this.by_key[key];
        this.by_tick[entry.tick].filter((k) => k !== entry.key);
        delete this.by_key[key];
        return entry;
    }
}

export class Track {
    public key = shortid();
    public entries = new Entries();
}
