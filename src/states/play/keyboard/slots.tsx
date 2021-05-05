import { FC, CSSProperties } from "react";
import { SLOT_HEIGHT } from "../const";
import { modulo, merge } from "../../../ui";

interface Props {
  className?: string;
  style?: CSSProperties;
  base: number; // MIDIPitch
  count: number; // number of slots
  isKeyboard: boolean;
}

export const Slots: FC<Props> = ({ className, style, base, count, isKeyboard }) => {
  const base_pattern = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
  const base_pattern_offset = 76; // E5
  const offset = base_pattern_offset - base;

  const white_key_space = (SLOT_HEIGHT * 12) / 7;
  const black_key_space = SLOT_HEIGHT;

  const pattern = [];
  for (let i = 0; i < count; i++) {
    const index = modulo(offset + i, base_pattern.length);
    pattern.push(base_pattern[index]);
  }

  return (
    <svg
      className={merge("slots", className)}
      style={style}
      width="64"
      height={SLOT_HEIGHT * count}
      xmlns="https://www.w3.org/2000/svg"
      viewBox={`0 0 64 ${SLOT_HEIGHT * count}`}
      preserveAspectRatio={isKeyboard ? undefined : "none"}
    >
      {/* White Keys */}
      {Array(pattern.reduce((out, val) => out - val, count + 2))
        .fill(null)
        .map((val, i) => {
          return (
            <rect
              key={i}
              fill={isKeyboard ? "#ffffff" : "var(--background-800)"}
              x={isKeyboard ? -3 : 0}
              y={i * white_key_space - modulo(offset * SLOT_HEIGHT, white_key_space)}
              width={isKeyboard ? 67 : 64}
              height={white_key_space - 1}
              rx={isKeyboard ? 3 : 0}
            />
          );
        })}

      {/* Black Keys */}
      {pattern.map((val, i) => {
        if (val === 1) {
          return (
            <rect
              key={i}
              fill={isKeyboard ? "var(--black)" : "var(--background-700)"}
              x={isKeyboard ? -3 : 0}
              y={black_key_space * i}
              width={isKeyboard ? 47 : 64}
              height={black_key_space}
              rx={isKeyboard ? 2.5 : 0}
            />
          );
        } else {
          return null;
        }
      })}

      {/* Labels */}
      {isKeyboard &&
        Array(9)
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
