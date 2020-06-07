import React, { useMemo } from "react";

import { Converter } from "showdown";
import showdownHighlight from "showdown-highlight";

import { useAlpha } from "../../hooks/use-alpha";
import { useStyles } from "../../hooks/use-styles";
import { merge } from "../../utils/merge";

import "highlight.js/styles/vs2015.css";
import "./styles.css";

interface Props {
    className: string;
    markdown: string;
    theme: string;
}

export const MarkdownContent: React.FC<Props> = ({ className, markdown, theme }) => {
    const faded = useAlpha(theme, 0.1);

    useStyles(`.markdown-content blockquote { border-left: 4px solid ${theme}; background-color: ${faded}; }`);
    useStyles(`.markdown-content a { color: ${theme}; }`);
    useStyles(`.markdown-content blockquote > p { color: ${theme}; }`);

    const html = useMemo(() => {
        const converter = new Converter({ extensions: [showdownHighlight], openLinksInNewWindow: true });
        return {
            __html: converter.makeHtml(markdown)
        };
    }, [markdown]);

    return <div className={merge("markdown-content", className)} dangerouslySetInnerHTML={html} />;
};
