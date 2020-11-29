import { TextStyles, Align, Justify, buildText, Text } from "../render/text";
import { EngravingConfig } from "../store/defs";
import { Player } from "../store/score-player/defs";
import { Flow } from "../store/score-flow/defs";
import { VerticalSpacing } from "./measure-verical-spacing";
import { Instruction } from "../render/instructions";

export function drawNames(
  x: number,
  y: number,
  width: number,
  names: { [key: string]: string },
  players: { order: string[]; by_key: { [key: string]: Player } },
  flow: Flow,
  verticalLayout: VerticalSpacing,
  config: EngravingConfig
) {
  const instructions: Instruction<Text>[] = [];

  const styles: TextStyles = {
    color: "#000000",
    font: config.instrumentName.font,
    size: config.instrumentName.size,
    justify: config.instrumentName.align,
    align: Align.Middle,
  };

  const left = config.instrumentName.align === Justify.Start ? x : x + width;

  players.order.forEach((player_key) => {
    if (flow.players[player_key]) {
      players.by_key[player_key].instruments.forEach((instrument_key) => {
        const top =
          y + verticalLayout.instruments[instrument_key].y + verticalLayout.instruments[instrument_key].height / 2;
        instructions.push(buildText(`${instrument_key}-name`, styles, left, top, names[instrument_key]));
      });
    }
  });

  return instructions;
}
