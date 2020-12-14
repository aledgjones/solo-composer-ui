import { NotationTrack } from "../parse/notation-track";

export function debugNotationTrack(track: NotationTrack) {
  let output = "";

  const ticks = Object.keys(track).map((t) => parseInt(t));
  ticks.forEach((tick) => {
    const event = track[tick];
    if (event.tones.length === 0) {
      output +=
        "r" +
        Array(event.duration - 2)
          .fill("-")
          .join("") +
        "¬";
    } else {
      output += "o";
      if (event.ties.length > 0) {
        output += Array(event.duration - 1)
          .fill("_")
          .join("");
      } else {
        output +=
          Array(event.duration - 2)
            .fill("-")
            .join("") + "¬";
      }
    }
  });

  return output;
}
