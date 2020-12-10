import { VerticalSpacing } from "./measure-verical-spacing";
import { VerticalSpans } from "./measure-vertical-spans";
import { EngravingConfig } from "../store/defs";

export function measureBracketAndBraces(spacing: VerticalSpacing, spans: VerticalSpans, config: EngravingConfig) {
  let max = 0;

  spans.brackets.forEach((bracket) => {
    if (config.bracketSingleStaves || bracket.stop !== bracket.start) {
      max = 1;
    }
  });

  max += spans.subBrackets.length > 0 ? 0.5 : 0;

  spans.braces.forEach((brace) => {
    const start = spacing.staves[brace.start];
    const stop = spacing.staves[brace.stop];
    const height = stop.y + stop.height - start.y;
    const width = height * 0.1;
    if (width > max) {
      max = width;
    }
  });

  return max;
}
