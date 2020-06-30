import React, { FC, Fragment } from "react";
import { State, useStore } from "../../../store";

import "./styles.css";

function injectVar(str: string, state: State) {
    const var_regex = /(@var:[^\s@]*:var@)/g;
    return str.replace(var_regex, (entry) => {
        switch (entry) {
            // generated
            case "@var:year:var@":
                return new Date().getFullYear().toString();
            // user-defined
            case "@var:project-title:var@":
                return state.score.meta.title;
            case "@var:project-subtitle:var@":
                return state.score.meta.subtitle;
            case "@var:project-composer:var@":
                return state.score.meta.composer;
            case "@var:project-arranger:var@":
                return state.score.meta.arranger;
            case "@var:project-lyricist:var@":
                return state.score.meta.lyricist;
            case "@var:project-copyright:var@":
                return state.score.meta.copyright;
            default:
                return str;
        }
    });
}

function injectSym(str: string) {
    const sym_regex = /@sym:[^\s@]*:sym@/g;

    const split = str.split(sym_regex).filter((entry) => entry); // filter any empties
    return split.map((entry) => {
        switch (entry) {
            // none-musical
            case "@sym:copy:sym@":
                return { content: "\u{00A9}", isMusicSymbol: false };
            // musical
            case "@sym:flat:sym@":
                return { content: "\u{E260}", isMusicSymbol: true };
            default:
                return { content: str, isMusicSymbol: false };
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
 * "Carinet in B@sym:flat:sym@" -> "Clarinet in B♭"
 */
export const Text: FC<Props> = ({ content }) => {
    const state = useStore((s) => s);
    const replaced = injectVar(content, state);
    console.log(replaced);
    const tokens = injectSym(replaced);

    return (
        <>
            {tokens.map((token, i) => {
                if (token.isMusicSymbol) {
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
