import { FC, useCallback } from "react";
import { mdiChevronDown, mdiCogOutline, mdiSizeS, mdiSizeM } from "@mdi/js";
import { Icon, noop, Label, Select, Option } from "../../../ui";
import { Text } from "../../../components/text";
import { Keyboard } from "../keyboard";
import { Fader } from "../fader";
import { useStore } from "../../../store/use-store";
import { PlayerType } from "../../../store/score-player/defs";
import { useCountStyle } from "../../../store/score-config/utils";
import { instrumentName } from "../../../store/score-instrument/utils";
import { actions } from "../../../store/actions";
import { SLOT_COUNT } from "../const";

import "./styles.css";

interface Props {
  color: string;
  playerType: PlayerType;
  count?: number;
  instrumentKey: string;
}

export const Controls: FC<Props> = ({ color, playerType, count, instrumentKey }) => {
  const [instrument, expanded, volume, mute, solo, staves, stave] = useStore(
    (s) => {
      return [
        s.score.instruments[instrumentKey],
        s.ui.play.expanded[instrumentKey],
        s.score.instruments[instrumentKey].volume,
        s.score.instruments[instrumentKey].mute,
        s.score.instruments[instrumentKey].solo,
        s.score.instruments[instrumentKey].staves,
        s.ui.play.stave[instrumentKey],
      ];
    },
    [instrumentKey]
  );
  const count_style = useCountStyle(playerType);
  const name = instrumentName(instrument, count_style, count);

  const onExpand = useCallback(() => {
    if (expanded) {
      actions.ui.play.collapse(instrument.key);
    } else {
      actions.ui.play.expand(instrument.key);
    }
  }, [expanded]);

  return (
    <div className="controls">
      <div className="controls__color" style={{ backgroundColor: color }} />
      <div className="controls__header">
        <p className="controls__name">
          <Text content={name} />
        </p>
        <Icon
          toggled={solo}
          style={{ marginRight: 12 }}
          path={mdiSizeS}
          size={24}
          onClick={() => {
            if (solo) {
              actions.score.instrument.unsolo(instrument.key);
            } else {
              actions.score.instrument.solo(instrument.key);
            }
          }}
        />
        <Icon
          toggled={mute}
          path={mdiSizeM}
          size={24}
          onClick={() => {
            if (mute) {
              actions.score.instrument.unmute(instrument.key);
            } else {
              actions.score.instrument.mute(instrument.key);
            }
          }}
        />
        <Icon
          style={{
            marginLeft: 12,
            transform: `rotateZ(${expanded ? "180deg" : "0"})`,
          }}
          size={24}
          path={mdiChevronDown}
          onClick={onExpand}
        />
      </div>
      {expanded && (
        <>
          <div className="controls__settings-wrapper">
            <div className="controls__settings">
              <div className="controls__settings-spacer">
                <Fader
                  instrumentKey={instrumentKey}
                  volume={volume}
                  color={color}
                  onChange={(volume: number) => actions.score.instrument.volume(instrument.key, volume)}
                />
                <Select value={stave} onChange={(val) => actions.ui.play.stave.set(instrumentKey, val)}>
                  <Option value={undefined} displayAs="All staves">
                    All staves
                  </Option>
                  {staves.map((staveKey, i) => {
                    return (
                      <Option key={staveKey} value={staveKey} displayAs={`Stave ${i + 1}`}>{`Stave ${i + 1}`}</Option>
                    );
                  })}
                </Select>
              </div>
              <div className="controls__sampler-config">
                <Icon style={{ marginRight: 20 }} path={mdiCogOutline} size={24} onClick={noop} />
                <Label className="controls__sampler-meta">
                  <p>Solo Sampler</p>
                  <p>{instrument.id}</p>
                </Label>
              </div>
            </div>
            <Keyboard instrumentKey={instrument.key} height={SLOT_COUNT} />
          </div>
        </>
      )}
    </div>
  );
};
