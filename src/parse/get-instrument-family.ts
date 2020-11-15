import { Instrument } from "../store/score-instrument/defs";

/** Get the instrument family of a specific instrument */
export function getInstrumentFamily(instrument?: Instrument) {
  return instrument ? instrument.id.split(".")[0] : "";
}
