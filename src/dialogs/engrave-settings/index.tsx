import { useState } from "react";
import { Button, Dialog, Input, Label, ListItem, Option, Select, Subheader, Switch } from "../../../ui";
import { LayoutType } from "../../store/defs";
import { useStore } from "../../store/use-store";
import { MenuItem } from "../../components/menu-item";
import { actions } from "../../store/actions";
import { BracketEndStyle, BracketingType } from "../../store/entries/brackets";

import staveSpace from "./examples/stave-space.svg";

import "../generic-settings.css";

enum Page {
  Barlines,
  BracketsAndBraces,
  NoteSpacing,
  Staves,
}

interface Props {
  onClose: () => void;
}

export const EngraveSettings = Dialog<Props>(({ onClose }) => {
  const [page, setPage] = useState<Page>(Page.Staves);
  const [layoutType, setLayoutType] = useState<LayoutType>(LayoutType.Score);

  const engraving = useStore(
    (s) => {
      return Object.values(s.score.engraving).find((c) => c.type === layoutType);
    },
    [layoutType]
  );

  return (
    <div className="generic-settings">
      <div className="generic-settings__content">
        <div className="generic-settings__left-panel">
          <MenuItem selected={page === Page.Barlines} onClick={() => setPage(Page.Barlines)}>
            Barlines
          </MenuItem>
          <MenuItem selected={page === Page.BracketsAndBraces} onClick={() => setPage(Page.BracketsAndBraces)}>
            Brackets &amp; Braces
          </MenuItem>
          <MenuItem selected={page === Page.NoteSpacing} onClick={() => setPage(Page.NoteSpacing)}>
            Note Spacing
          </MenuItem>
          <MenuItem selected={page === Page.Staves} onClick={() => setPage(Page.Staves)}>
            Staves
          </MenuItem>
        </div>

        <div className="generic-settings__right-panel">
          {page === Page.Barlines && (
            <>
              <div className="generic-settings__section">
                <Subheader style={{ marginBottom: 0 }}>Systemic Barlines</Subheader>
              </div>
              <ListItem
                style={{ marginBottom: 20 }}
                onClick={() =>
                  actions.score.engraving.update(engraving.key, {
                    systemicBarlineSingleInstrumentSystem: !engraving.systemicBarlineSingleInstrumentSystem,
                  })
                }
              >
                <Label>
                  <p>Use systemic barlines for single stave systems.</p>
                  <p>Systemic barlines will always be used with multiple instruments.</p>
                </Label>
                <Switch value={engraving.systemicBarlineSingleInstrumentSystem} />
              </ListItem>
            </>
          )}

          {page === Page.BracketsAndBraces && (
            <>
              <div className="generic-settings__section" style={{ paddingBottom: 20 }}>
                <Subheader>Approach</Subheader>
                <Select
                  className="ui-select--margin"
                  value={engraving.bracketing}
                  onChange={(val: BracketingType) => actions.score.engraving.update(engraving.key, { bracketing: val })}
                >
                  <Option value={BracketingType.None} displayAs="None">
                    None
                  </Option>
                  <Option value={BracketingType.Orchestral} displayAs="Orchestral">
                    Orchestral
                  </Option>
                  <Option value={BracketingType.SmallEnsemble} displayAs="Small ensemble">
                    Small ensemble
                  </Option>
                </Select>
              </div>
              <ListItem
                disabled={engraving.bracketing === BracketingType.None}
                onClick={() =>
                  actions.score.engraving.update(engraving.key, {
                    bracketSingleStaves: !engraving.bracketSingleStaves,
                  })
                }
              >
                <Label>
                  <p>Bracket single instruments.</p>
                  <p>Use a bracket for isolated instruments of a particular instrument family.</p>
                </Label>
                <Switch value={engraving.bracketSingleStaves} />
              </ListItem>
              <ListItem
                disabled={engraving.bracketing === BracketingType.None}
                style={{ marginBottom: 20 }}
                onClick={() =>
                  actions.score.engraving.update(engraving.key, {
                    subBracket: !engraving.subBracket,
                  })
                }
              >
                <Label>
                  <p>Use sub-brackets.</p>
                  <p>Bracket consecutive instruments of the same type.</p>
                </Label>
                <Switch value={engraving.subBracket} />
              </ListItem>

              <div className="generic-settings__section">
                <Subheader>Design</Subheader>
                <Select
                  value={engraving.bracketEndStyle}
                  onChange={(val: BracketEndStyle) =>
                    actions.score.engraving.update(engraving.key, {
                      bracketEndStyle: val,
                    })
                  }
                >
                  <Option value={BracketEndStyle.None} displayAs="None">
                    None
                  </Option>
                  <Option value={BracketEndStyle.Line} displayAs="Lines">
                    Lines
                  </Option>
                  <Option value={BracketEndStyle.Wing} displayAs="Wings">
                    Wings
                  </Option>
                </Select>
              </div>
            </>
          )}

          {page === Page.NoteSpacing && (
            <>
              <div className="generic-settings__section">
                <Subheader>Note Spacing</Subheader>
                <Subheader subtle>Default space for crotchet/quarter notes</Subheader>
                <Input
                  required
                  type="number"
                  value={engraving.baseNoteSpace}
                  precision={2}
                  step={0.01}
                  units="spaces"
                  onChange={(val: number) => actions.score.engraving.update(engraving.key, { baseNoteSpace: val })}
                />
                <Subheader subtle>Minium space for short notes</Subheader>
                <Input
                  required
                  type="number"
                  value={engraving.minNoteSpace}
                  precision={2}
                  step={0.01}
                  units="spaces"
                  onChange={(val: number) => actions.score.engraving.update(engraving.key, { minNoteSpace: val })}
                />
                <Subheader subtle>Note space ratio</Subheader>
                <Input
                  required
                  type="number"
                  value={engraving.noteSpaceRatio}
                  precision={2}
                  step={0.01}
                  onChange={(val: number) => actions.score.engraving.update(engraving.key, { noteSpaceRatio: val })}
                />
              </div>
            </>
          )}

          {page === Page.Staves && (
            <>
              <div className="generic-settings__section">
                <Subheader>Space Size</Subheader>
                <div className="generic-settings__input-with-img">
                  <img alt="Stave spacing" src={staveSpace} className="generic-settings__example" width="95" />
                  <Input
                    required
                    type="number"
                    value={engraving.space}
                    precision={2}
                    step={0.01}
                    units="mm"
                    onChange={(val: number) => actions.score.engraving.update(engraving.key, { space: val })}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="generic-settings__buttons">
        <Select direction="up" style={{ width: 300, marginRight: 8 }} value={layoutType} onChange={setLayoutType}>
          <Option value={LayoutType.Score} displayAs="Score">
            Score
          </Option>
          <Option value={LayoutType.Part} displayAs="Part">
            Part
          </Option>
        </Select>
        <Button compact outline>
          Reset All
        </Button>
        <div className="generic-settings__spacer" />
        <Button compact onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
});
