import { buildText, TextStyles, Justify, Align } from "../render/text";
import { VerticalSpacing } from "./measure-verical-spacing";
import { VerticalSpans } from "./measure-vertical-spans";

export function drawBraces(
    x: number,
    y: number,
    spacing: VerticalSpacing,
    spans: VerticalSpans
) {
    const styles: TextStyles = {
        color: "#000000",
        font: "Bravura",
        size: 0.0,
        justify: Justify.End,
        align: Align.Middle,
    };

    return spans.braces.map((brace) => {
        const start = spacing.staves[brace.start];
        const stop = spacing.staves[brace.stop];

        const height = stop.y + stop.height - start.y;
        const top = y + (stop.y + stop.height / 2);

        return buildText(
            `${brace.start}-brace`,
            { ...styles, size: height },
            x - 0.25,
            top,
            "\u{E000}"
        );
    });
}
