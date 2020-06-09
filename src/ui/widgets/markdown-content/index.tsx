import React, { useMemo } from "react";

import { Converter } from "showdown";
import showdownHighlight from "showdown-highlight";
import { merge } from "../../utils/merge";

import "highlight.js/styles/vs2015.css";
import "./styles.css";

interface Props {
    className: string;
    markdown: string;
}

export const MarkdownContent: React.FC<Props> = ({ className, markdown }) => {
    const html = useMemo(() => {
        const converter = new Converter({
            extensions: [showdownHighlight],
            openLinksInNewWindow: true
        });
        return {
            __html: converter.makeHtml(markdown)
        };
    }, [markdown]);

    return <div className={merge("markdown-content", className)} dangerouslySetInnerHTML={html} />;
};
