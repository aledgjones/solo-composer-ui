import React, { FC } from "react";
import { SLOT_HEIGHT } from "../const";
import { modulo } from "../../../ui";

interface Props {
    base: number; // MIDIPitch
    height: number; // number of slots
}

export const Keys: FC<Props> = ({ base, height }) => {
    const base_pattern = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
    const base_pattern_offset = 76; // E5
    const offset = base_pattern_offset - base;

    const white_key_space = (SLOT_HEIGHT * 12) / 7;
    const black_key_space = SLOT_HEIGHT;

    const pattern = [];
    for (let i = 0; i < height; i++) {
        const index = modulo(offset + i, base_pattern.length);
        pattern.push(base_pattern[index]);
    }

    return (
        <svg
            className="keyboard__keys"
            width="64"
            height={SLOT_HEIGHT * height}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 64 ${SLOT_HEIGHT * height}`}
        >
            {/* White Keys */}
            {Array(pattern.reduce((out, val) => out - val, height + 2))
                .fill(null)
                .map((val, i) => {
                    return (
                        <rect
                            key={i}
                            fill="#ffffff"
                            x="-3"
                            y={i * white_key_space - modulo(offset * SLOT_HEIGHT, white_key_space)}
                            width="67"
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
                            width="47"
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
                            x="48"
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
};
