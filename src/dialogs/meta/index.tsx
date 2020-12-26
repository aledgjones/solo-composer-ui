import { Dialog, Button, Subheader, Input, Textarea } from "../../../ui";
import { TagCopier } from "../../components/tag-copier";
import { useStore } from "../../store/use-store";
import { actions } from "../../store/actions";

import "../generic-settings.css";

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
              <TagCopier content="${project-title}" />
            </p>
            <Input type="text" value={meta.title} onChange={(title) => actions.score.meta.update({ title })} />
          </div>
          <div className="generic-settings__label-with-input">
            <p className="generic-settings__label">
              <span>Subtitle</span>
              <TagCopier content="${project-subtitle}" />
            </p>
            <Input type="text" value={meta.subtitle} onChange={(subtitle) => actions.score.meta.update({ subtitle })} />
          </div>
          <div className="generic-settings__label-with-input">
            <p className="generic-settings__label">
              <span>Composer</span>
              <TagCopier content="${project-composer}" />
            </p>
            <Input type="text" value={meta.composer} onChange={(composer) => actions.score.meta.update({ composer })} />
          </div>
          <div className="generic-settings__label-with-input">
            <p className="generic-settings__label">
              <span>Arranger</span>
              <TagCopier content="${project-arranger}" />
            </p>
            <Input type="text" value={meta.arranger} onChange={(arranger) => actions.score.meta.update({ arranger })} />
          </div>
          <div className="generic-settings__label-with-input">
            <p className="generic-settings__label">
              <span>Lyricist</span>
              <TagCopier content="${project-lyricist}" />
            </p>
            <Input type="text" value={meta.lyricist} onChange={(lyricist) => actions.score.meta.update({ lyricist })} />
          </div>
          <div className="generic-settings__label-with-input">
            <p className="generic-settings__label">
              <span>Copyright</span>
              <TagCopier content="${project-copyright}" />
            </p>
            <Textarea value={meta.copyright} onChange={(copyright) => actions.score.meta.update({ copyright })} />
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
