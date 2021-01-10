import { VerticalSpans } from "./measure-vertical-spans";
import { Instruction } from "../render/instructions";
import { VerticalSpacing } from "./measure-verical-spacing";
import { EngravingConfig } from "../store/defs";
import { BracketEndStyle } from "../store/entries/brackets";
import { buildLine } from "../render/line";
import { TextStyles, Justify, Align, buildText } from "../render/text";

export function drawBrackets(
  x: number,
  y: number,
  spacing: VerticalSpacing,
  spans: VerticalSpans,
  config: EngravingConfig
) {
  // if n > 1 neightbouring instruments in same family -- woodwind, brass, strings only!
  // subbrace if same instrument type next to each other

  const left = x - 0.75;

  const thick = { color: "#000000", thickness: 0.5 };
  const thin = { color: "#000000", thickness: 0.125 };

  return spans.brackets.reduce((out: Instruction<any>, bracket) => {
    // short circuit if its a single stave and we don't want single staves bracketed.
    if (!config.bracketSingleStaves && bracket.start === bracket.stop) {
      return out;
    }

    const start = spacing.instruments[bracket.start];
    const stop = spacing.instruments[bracket.stop];
    const tweekForWing = 0.3125; // .25 + .0625;
    const tweekForStave = 0.0625;

    const top = y + start.y;
    const bottom = y + stop.y + stop.height;

    if (config.bracketEndStyle === BracketEndStyle.None) {
      out.push(
        // thick line
        buildLine(`${bracket.start}-vertical-bar`, thick, [left, top - tweekForStave], [left, bottom + tweekForStave])
      );
    }

    if (config.bracketEndStyle === BracketEndStyle.Line) {
      out.push(
        // thick line
        buildLine(`${bracket.start}-vertical-bar`, thick, [left, top - tweekForStave], [left, bottom + tweekForStave]),
        // thin lines
        buildLine(`${bracket.start}-cap--top`, thin, [left - 0.25, top], [x, top]),
        buildLine(`${bracket.start}-cap--bottom`, thin, [left - 0.25, bottom], [x, bottom])
      );
    }

    if (config.bracketEndStyle === BracketEndStyle.Wing) {
      const capLeft = x - 1.0;
      const glyphTop = "\u{E003}";
      const glyphBottom = "\u{E004}";
      const styles: TextStyles = {
        color: "#000000",
        justify: Justify.Start,
        align: Align.Middle,
        font: "Bravura",
        size: 4,
        lineHeight: 1,
      };
      out.push(
        // thick line
        buildLine(`${bracket.start}-vertical-bar`, thick, [left, top - tweekForWing], [left, bottom + tweekForWing]),
        // wings
        buildText(`${bracket.start}-wing--top`, styles, capLeft, top - tweekForWing, glyphTop),
        buildText(`${bracket.start}-wing--bottom`, styles, capLeft, bottom + tweekForWing, glyphBottom)
      );
    }

    return out;
  }, []);
}
