import { ConverterGroup } from "./converter";
import { TextStyles } from "../render/text";

export function measureText(styles: TextStyles, text: string, spaces: ConverterGroup, px: ConverterGroup) {
    const canvas = new OffscreenCanvas(1000, 100);
    const ctx = canvas.getContext("2d");
    if (ctx) {
        const { size, font } = styles;
        ctx.font = `${spaces.toPX(size)}px ${font}`;
        return px.toSpaces(ctx.measureText(text).width);
    } else {
        return 0;
    }
}
