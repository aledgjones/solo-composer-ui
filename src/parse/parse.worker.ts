import shortid from "shortid";
import { parse } from "./index";

const ctx = (self as unknown) as Worker; // eslint-disable-line

(() => {
  var bravura = new FontFace("Bravura", "url('/fonts/bravura.woff2')");
  var libreBaskerville = new FontFace("Libre Baskerville", "url('/fonts/libre-baskerville.woff2')");
  Promise.all([bravura.load(), libreBaskerville.load()]).then((faces) => {
    faces.map((font) => {
      (self as any).fonts.add(font);
    });
  });
})();

let latestTaskID = shortid();

interface Data {
  mm: number;
  score: any;
  flow_key: string;
  debug: boolean;
}

ctx.addEventListener("message", async (e) => {
  const { mm, score, flow_key, debug } = e.data as Data;
  const taskID = shortid();
  latestTaskID = taskID;

  if (debug) {
    performance.mark("start");
  }

  const instructions = await parse(score, flow_key, mm, debug);

  if (debug) {
    performance.measure("parse", "start");

    const entries = performance.getEntriesByType("measure");
    const duration = entries[entries.length - 1].duration;
    console.log(
      `duration: %c${duration}`,
      (duration < 1000 / 60 && "color: green") || (duration < 1000 / 30 && "color: orange") || "color: red"
    );
  }

  if (taskID === latestTaskID) {
    ctx.postMessage(instructions);
  }
});

export default null as any;
