import React, { FC, CSSProperties } from "react";

import "./styles.css";
import { merge } from "../../ui";

interface Props {
    className?: string;
    style?: CSSProperties;
    offset?: number;
}

export const Text: FC<Props> = ({ className, style, children }) => {
    const regex = /(@[^\s@]*@)/g;
    const text = children ? children.toString() : "";
    const split = text.split(regex).filter((entry) => entry); // filter any empties
    const tokens = split.map((str) => {
        const isToken = regex.test(str);
        return {
            isToken,
            text: isToken ? str.slice(1, -1) : str
        };
    });

    return (
        <div className={merge("text", className)} style={style}>
            {tokens.map((e, i) => {
                if (e.isToken) {
                    return (
                        <span key={i} className="text--token">
                            {e.text}
                        </span>
                    );
                } else {
                    return <span key={i}>{e.text}</span>;
                }
            })}
        </div>
    );
};
