export function debugBeams(length: number, beams: Set<number[]>) {
  let output = new Array(length).fill(".");
  beams.forEach((beam) => {
    for (let i = beam[0]; i <= beam[beam.length - 1]; i++) {
      if (beam.includes(i)) {
        output[i] = "+";
      } else {
        output[i] = "-";
      }
    }
  });

  return output.join("");
}
