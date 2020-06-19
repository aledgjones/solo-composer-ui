import React, { FC, CSSProperties } from "react";
import { merge } from "../../../ui";
import { State, useStore } from "../../../store";

import "./styles.css";

function injectVar(str: string, state: State) {
    const var_regex = /(@var:[^\s@]*:var@)/g;
    return str.replace(var_regex, () => {
        switch (str) {
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

const symDictionary: { [sym: string]: string } = {
    "@sym:flat:sym@": "\u{E260}"
};

function injectSym(str: string) {
    const sym_regex = /(@sym:[^\s@]*:sym@)/g;

    const split = str.split(sym_regex).filter((entry) => entry); // filter any empties
    return split.map((str) => {
        const sym = symDictionary[str];
        return {
            isSymbol: sym,
            text: sym || str
        };
    });
}

interface Props {
    className?: string;
    style?: CSSProperties;
    offset?: number;
}

/**
 * Converts a string of text with tokens in a formed string eg.
 * This uses the music font for music symbols.
 *
 * "Carinet in B@flat@" -> "Clarinet in B♭"
 */
export const Text: FC<Props> = ({ className, style, children }) => {
    const state = useStore((s) => s);
    const text = children ? children.toString() : "";
    const replaced = injectVar(text, state);
    const tokens = injectSym(replaced);

    return (
        <>
            {tokens.map((e, i) => {
                if (e.isSymbol) {
                    return (
                        <span key={i} className="text--symbol">
                            {e.text}
                        </span>
                    );
                } else {
                    return <span key={i}>{e.text}</span>;
                }
            })}
        </>
    );
};
