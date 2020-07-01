import React, { FC, Fragment } from "react";
import { State, useStore } from "../../../store";

import "./styles.css";

const varDict: { [key: string]: (state: State) => string } = {
    // generated
    "${year}": () => new Date().getFullYear().toString(),
    "${month}": () => new Date().getMonth().toString().padStart(2, "0"),
    "${date}": () => new Date().getDate().toString().padStart(2, "0"),
    // user-defined
    "${project-title}": (state) => state.score.meta.title,
    "${project-subtitle}": (state) => state.score.meta.subtitle,
    "${project-composer}": (state) => state.score.meta.composer,
    "${project-arranger}": (state) => state.score.meta.arranger,
    "${project-lyricist}": (state) => state.score.meta.lyricist,
    "${project-copyright}": (state) => state.score.meta.copyright
};

function injectVar(content: string, state: State) {
    const var_regex = /(\${[^\s@]*})/g;
    return content.replace(var_regex, (token) => {
        const replacer = varDict[token];
        if (replacer) {
            return replacer(state);
        } else {
            return token;
        }
    });
}
const symDict: { [key: string]: { content: string; sym: boolean } } = {
    // non-musical
    "${copy}": { content: "\u{00A9}", sym: false },
    // musical
    "${flat}": { content: "\u{E260}", sym: true }
};

function injectSym(content: string) {
    const sym_regex = /(\${[^\s@]*})/g;

    const split = content.split(sym_regex).filter((entry) => entry); // filter any empties
    return split.map((entry) => {
        const replacer = symDict[entry];
        if (replacer) {
            return replacer;
        } else {
            return { content: entry, sym: false };
        }
    });
}

interface Props {
    content: string;
}

/**
 * Converts a string of text with tokens in a formed string eg.
 * This uses the music font for music symbols.
 *
 * "Carinet in B${flat}" -> "Clarinet in B♭"
 */
export const Text: FC<Props> = ({ content }) => {
    const state = useStore((s) => s);
    const replaced = injectVar(content, state);
    const tokens = injectSym(replaced);

    return (
        <>
            {tokens.map((token, i) => {
                if (token.sym) {
                    return (
                        <span key={i} className="text--music-symbol">
                            {token.content}
                        </span>
                    );
                } else {
                    return <Fragment key={i}>{token.content}</Fragment>;
                }
            })}
        </>
    );
};
