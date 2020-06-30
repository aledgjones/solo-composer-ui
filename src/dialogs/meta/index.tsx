import React from "react";
import { Dialog, Button, Subheader, Input, Textarea } from "../../../ui";
import { useStore, actions } from "../../../store";
import { TagCopier } from "../../components/tag-copier";

import "../generic-settings.css";
import "./styles.css";

interface Props {
    onClose: () => void;
}

export const Meta = Dialog<Props>(({ onClose }) => {
    const meta = useStore((s) => s.score.meta);

    return (
        <div className="meta">
            <div className="generic-settings__content">
                <div className="generic-settings__section">
                    <Subheader style={{ paddingLeft: 160 }}>Project Information</Subheader>
                    <div className="generic-settings__label-with-input">
                        <p className="generic-settings__label">
                            <span>Title</span>
                            <TagCopier content="@var:project-title:var@" />
                        </p>
                        <Input type="text" value={meta.title} onChange={actions.score.meta.title} />
                    </div>
                    <div className="generic-settings__label-with-input">
                        <p className="generic-settings__label">
                            <span>Subtitle</span>
                            <TagCopier content="@var:project-subtitle:var@" />
                        </p>
                        <Input type="text" value={meta.subtitle} onChange={actions.score.meta.subtitle} />
                    </div>
                    <div className="generic-settings__label-with-input">
                        <p className="generic-settings__label">
                            <span>Composer</span>
                            <TagCopier content="@var:project-composer:var@" />
                        </p>
                        <Input type="text" value={meta.composer} onChange={actions.score.meta.composer} />
                    </div>
                    <div className="generic-settings__label-with-input">
                        <p className="generic-settings__label">
                            <span>Arranger</span>
                            <TagCopier content="@var:project-arranger:var@" />
                        </p>
                        <Input type="text" value={meta.arranger} onChange={actions.score.meta.arranger} />
                    </div>
                    <div className="generic-settings__label-with-input">
                        <p className="generic-settings__label">
                            <span>Lyricist</span>
                            <TagCopier content="@var:project-lyricist:var@" />
                        </p>
                        <Input type="text" value={meta.lyricist} onChange={actions.score.meta.lyricist} />
                    </div>
                    <div className="generic-settings__label-with-input">
                        <p className="generic-settings__label">
                            <span>Copyright</span>
                            <TagCopier content="@var:project-copyright:var@" />
                        </p>
                        <Textarea value={meta.copyright} onChange={actions.score.meta.copyright} />
                    </div>
                </div>
            </div>

            <div className="generic-settings__buttons">
                <div className="generic-settings__spacer" />
                <Button compact onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
});
