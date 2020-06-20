import React, { FC, PointerEvent } from "react";
import { SLOT_HEIGHT } from "../const";
import { modulo } from "../../../ui";

interface Props {
    base: number; // MIDIPitch
}

export const Keys: FC<Props> = ({ base }) => {
    const height = SLOT_HEIGHT * 24;

    const base_pattern_offset = 76; // E5
    const offset = base_pattern_offset - base;
    const base_pattern = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];

    const pattern = [];
    for (let i = 0; i < base_pattern.length; i++) {
        const index = modulo(offset + i, base_pattern.length);
        pattern.push(base_pattern[index]);
    }

    const white_key_space = height / 14;
    const black_key_space = SLOT_HEIGHT;

    return (
        <svg
            className="keyboard__keys"
            width="64"
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 64 ${height}`}
        >
            {/* White Keys */}
            {Array(15)
                .fill(null)
                .map((val, i) => {
                    return (
                        <rect
                            fill="var(--white)"
                            x="-3"
                            y={i * white_key_space - modulo(offset * SLOT_HEIGHT, white_key_space)}
                            width="59"
                            height={white_key_space - 1}
                            rx="3"
                        />
                    );
                })}

            {/* Black Keys */}
            {pattern.map((val, i) => {
                if (val === 1) {
                    return (
                        <rect
                            key={i}
                            fill="var(--black)"
                            x="-3"
                            y={black_key_space * i}
                            width="39"
                            height={black_key_space}
                            rx="2.5"
                        />
                    );
                } else {
                    return null;
                }
            })}

            {/* Labels */}
            {Array(9)
                .fill(null)
                .map((val, i) => {
                    return (
                        <text
                            key={i}
                            fontSize="10"
                            fill="var(--black)"
                            alignmentBaseline="central"
                            x="40"
                            y={
                                i * (12 * SLOT_HEIGHT) + // space an octave apart
                                2.5 * white_key_space - // shift to the C
                                3 * (SLOT_HEIGHT * 12) - // offset all so C5 is in the correct octave
                                offset * SLOT_HEIGHT // make it move
                            }
                        >
                            C{8 - i}
                        </text>
                    );
                })}
        </svg>
    );

    // return useMemo(() => {
    //     const light = "transparent";
    //     const dark = "#000000";

    //     const keyboardKeys = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
    //     const whiteKeyHeight = (SLOT_HEIGHT * 12) / 7;

    //     const whiteKeys = Array(7)
    //         .fill("")
    //         .map((none, i) => {
    //             return `${light} ${whiteKeyHeight * i}px ${whiteKeyHeight * (i + 1) - 1}px, ${dark} ${
    //                 whiteKeyHeight * (i + 1) - 1
    //             }px ${whiteKeyHeight * (i + 1)}px`;
    //         });

    //     const blackKeys = keyboardKeys.map((key, i) => {
    //         if (key === 0) {
    //             return `${light} ${SLOT_HEIGHT * i}px ${SLOT_HEIGHT * (i + 1)}px`;
    //         } else {
    //             return `${dark} ${SLOT_HEIGHT * i}px ${SLOT_HEIGHT * (i + 1)}px`;
    //         }
    //     });

    //     return `linear-gradient(${whiteKeys.join(",")}), linear-gradient(${blackKeys.join(",")})`;
    // }, []);
};
