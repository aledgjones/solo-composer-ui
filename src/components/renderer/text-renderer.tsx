import { FC } from "react";
import { merge } from "../../ui";
import { TextInstruction, textStyle } from "../../render/text";
import { Text } from "../text";
import { Entry } from "../../store/entries/defs";

interface Props {
  text: TextInstruction;
  space: number;
  selection: { [key: string]: Entry };
  onSelect: (entry: Entry) => void;
}

export const TextRenderer: FC<Props> = ({ text, space, selection, onSelect }) => {
  return (
    <foreignObject
      className="renderer__entry--text no-scroll"
      key={text.key}
      x={text.x * space}
      y={text.y * space}
      style={{
        overflow: "visible",
      }}
    >
      <div
        onClick={() => {
          if (onSelect && text.entry) {
            onSelect(text.entry);
          }
        }}
        className={merge(
          "renderer__entry-container--text",
          {
            "entry--selected": text.entry && selection && !!selection[text.entry.key],
          },
          text.className
        )}
        style={{
          position: "absolute",
          color: text.styles.color,
          fontFamily: text.styles.font,
          fontSize: text.styles.size * space,
          lineHeight: text.styles.lineHeight,
          whiteSpace: "pre",
          ...textStyle(text.styles.align, text.styles.justify),
        }}
      >
        <Text content={text.value} />
      </div>
    </foreignObject>
  );
};
