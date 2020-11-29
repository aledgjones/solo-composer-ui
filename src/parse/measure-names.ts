import { TextStyles, Justify, Align } from "../render/text";
import { measureText } from "./measure-text";
import { EngravingConfig } from "../store/defs";
import { ConverterGroup } from "./converter";

export function measureNames(names: string[], config: EngravingConfig, spaces: ConverterGroup, px: ConverterGroup) {
  const styles: TextStyles = {
    color: "#000000",
    font: config.instrumentName.font,
    size: config.instrumentName.size,
    justify: Justify.Start,
    align: Align.Top,
  };
  const boxes = names.map((name) => measureText(styles, name, spaces, px));
  return Math.max(...boxes, 0); // add a zero incase we dont actually have any widths
}
