export function debugBeams(length: number, beams: Map<number, number[]>) {
  let output = new Array(length).fill(".");
  beams.forEach((beam, tick) => {
    for (let i = tick; i <= beam[beam.length - 1]; i++) {
      if (beam.includes(i)) {
        output[i] = "+";
      } else {
        output[i] = "-";
      }
    }
  });

  return output.join("");
}
