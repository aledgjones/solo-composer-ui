import { VerticalSpacing } from "./measure-verical-spacing";
import { VerticalSpans } from "./measure-vertical-spans";
import { EngravingConfig } from "../store/defs";

export function measureBracketAndBraces(
  spacing: VerticalSpacing,
  spans: VerticalSpans,
  config: EngravingConfig
) {
  let max = spans.brackets.length > 0 ? 1 : 0;
  max = max + (spans.subBrackets.length > 0 ? 0.5 : 0);

  spans.braces.forEach((brace) => {
    // don't count single staves if config requires
    if (!config.bracketSingleStaves && brace.start === brace.stop) {
      return max;
    }
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
