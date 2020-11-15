import { Entry } from "../entries";

export interface Entries {
  by_tick: { [tick: number]: string[] };
  by_key: { [key: string]: Entry }; // The typing stop here we will never actually use these js side.
}

export interface Track {
  key: string;
  entries: Entries;
}
