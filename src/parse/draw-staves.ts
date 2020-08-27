import { VerticalSpacing } from "./measure-verical-spacing";
import { PathInstruction, buildPath } from "../render/path";
import { Player } from "../store/score-player/defs";
import { Instrument } from "../store/score-instrument/defs";
import { Flow } from "../store/score-flow/defs";
import { Stave } from "../store/score-stave/defs";

export function drawStaves(
    x: number,
    y: number,
    width: number,
    players: { order: string[]; by_key: { [key: string]: Player } },
    instruments: { [key: string]: Instrument },
    flow: Flow,
    vertical_layout: VerticalSpacing,
    drawSystemicBarlineSingleStave: boolean
) {
    const tweakForStaveLineWidth = 0.0625;
    const styles = { color: "#000000", thickness: 0.125 };

    const paths: PathInstruction[] = [];

    const staves = players.order.reduce<Stave[]>((out, player_key) => {
        if (flow.players[player_key]) {
            const player = players.by_key[player_key];
            player.instruments.forEach((instrument_key) => {
                const instrument = instruments[instrument_key];
                instrument.staves.forEach((stave_key) => {
                    out.push(flow.staves[stave_key]);
                });
            });
        }
        return out;
    }, []);

    // render staves
    staves.forEach((stave) => {
        for (let i = 0; i < stave.lines.length; i++) {
            if (stave.lines[i] === 1) {
                const start = y + vertical_layout.staves[stave.key].y + i;
                paths.push(
                    buildPath(
                        `${stave.key}-stave-${i}`,
                        styles,
                        [x, start],
                        [x + width, start]
                    )
                );
            }
        }
    });

    // render stystemic barline
    if (staves.length > 1 || drawSystemicBarlineSingleStave) {
        paths.push(
            buildPath(
                "systemic-barline",
                styles,
                [x, y - tweakForStaveLineWidth],
                [x, y + vertical_layout.height + tweakForStaveLineWidth]
            )
        );
    }

    return paths;
}
