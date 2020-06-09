import React, { useState } from "react";
import {
    mdiClose,
    mdiEmailOutline,
    mdiGithub,
    mdiWeb,
    mdiFileDocumentOutline,
    mdiArrowLeft
} from "@mdi/js";

import {
    Dialog,
    Input,
    Icon,
    Content,
    Subheader,
    ListItem,
    Label,
    Spinner,
    MarkdownContent
} from "../../ui";
import { useArticle, useArticlesList, Article, ArticleState } from "./use-article";

import pkg from "../../../package.json";
import "./styles.css";

interface Props {
    onClose: () => void;
}

export const Help = Dialog<Props>(({ onClose }) => {
    const [search, setSearch] = useState("");

    const articles = useArticlesList();
    const [article, setArticle] = useState<Article>();
    const { state, content } = useArticle(article);

    return (
        <div className="feedback">
            <div className="feedback__header">
                <div className="feedback__header-text">
                    {state !== ArticleState.void && (
                        <Icon
                            path={mdiArrowLeft}
                            size={24}
                            style={{ color: "#000000", marginRight: 20 }}
                            onClick={() => setArticle(undefined)}
                        />
                    )}
                    <h1 className="feedback__title">Help &amp; Feedback</h1>
                    <Icon
                        path={mdiClose}
                        style={{ color: "#000000" }}
                        size={24}
                        onClick={onClose}
                    />
                </div>
                <Input type="search" value={search} onChange={setSearch} label="Search Help" />
                {search && (
                    <p className="feedback__no-result">
                        Search functionality will be added shortly
                    </p>
                )}
            </div>
            {state === ArticleState.void && (
                <Content className="feedback__content">
                    <Subheader className="feedback__subheader">Featured Articles</Subheader>
                    {articles.featured.map((slug) => {
                        const article = articles.articles[slug];
                        return (
                            <ListItem key={article.url} onClick={() => setArticle(article)}>
                                <Icon
                                    path={mdiFileDocumentOutline}
                                    style={{ color: "var(--primary-500-bg)" }}
                                    size={24}
                                />
                                <Label>
                                    <p>{article.title}</p>
                                    <p>{article.description}</p>
                                </Label>
                            </ListItem>
                        );
                    })}
                    <Subheader className="feedback__subheader">Feedback</Subheader>
                    <a
                        href={`mailto:aledjones.viola@gmail.com?subject=Feedback - Solo Composer ${pkg.version}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ListItem className="ui-list-item--hover">
                            <Icon
                                path={mdiEmailOutline}
                                style={{ color: "var(--primary-500-bg)" }}
                                size={24}
                            />
                            <Label>
                                <p>Get in touch by email</p>
                                <p>aledjones.viola@gmail.com</p>
                            </Label>
                        </ListItem>
                    </a>
                    <a
                        href="https://github.com/aledgjones/solo-composer"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ListItem className="ui-list-item--hover">
                            <Icon
                                path={mdiGithub}
                                style={{ color: "var(--primary-500-bg)" }}
                                size={24}
                            />
                            <Label>
                                <p>Visit the Github repository</p>
                                <p>github.com/aledgjones/solo-composer</p>
                            </Label>
                        </ListItem>
                    </a>
                    <a href="https://aledjones.net" target="_blank" rel="noopener noreferrer">
                        <ListItem className="ui-list-item--hover">
                            <Icon
                                path={mdiWeb}
                                style={{ color: "var(--primary-500-bg)" }}
                                size={24}
                            />
                            <Label>
                                <p>Visit developer website</p>
                                <p>aledjones.net</p>
                            </Label>
                        </ListItem>
                    </a>
                </Content>
            )}

            {state === ArticleState.loading && (
                <Content className="feedback__empty">
                    <Spinner color="#000000" size={24} />
                </Content>
            )}

            {state === ArticleState.error && (
                <Content className="feedback__empty">
                    <p className="feedback__no-result">This article was not found.</p>
                </Content>
            )}

            {state === ArticleState.ready && (
                <div className="feedback__content">
                    <MarkdownContent className="help" markdown={content} />
                    {article && article.related.length > 0 && (
                        <div className="feedback__related">
                            <Subheader className="feedback__subheader feedback__subheader--close">
                                Related
                            </Subheader>
                            {article?.related.map((slug) => {
                                const related = articles.articles[slug];
                                console.log(related);
                                return (
                                    <ListItem key={related.url} onClick={() => setArticle(related)}>
                                        <Icon
                                            path={mdiFileDocumentOutline}
                                            style={{ color: "var(--primary-500-bg)" }}
                                            size={24}
                                        />
                                        <Label>
                                            <p>{related.title}</p>
                                            <p>{related.description}</p>
                                        </Label>
                                    </ListItem>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});
