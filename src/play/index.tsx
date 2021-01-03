import { FC, useCallback } from "react";
import { mdiCursorDefault, mdiEraser, mdiPen, mdiBoxCutter, mdiPlus, mdiMinus } from "@mdi/js";
import { useTitle, useRainbow, Icon, DragScroll, Select, Option } from "../../ui";
import { Controls } from "./controls";
import { Track } from "./track";
import { PlayHead } from "./play-head";
import { Ticks } from "./ticks";
import { useStore } from "../store/use-store";
import { useCounts } from "../store/score-instrument/hooks";
import { useTicks } from "../store/score-flow/hooks";
import { actions } from "../store/actions";
import { Tool } from "../store/ui/defs";
import { NoteDuration } from "../store/entries/defs";

import "./styles.css";
import { useHotkeys } from "react-hotkeys-hook";

const Play: FC = () => {
  useTitle("Solo Composer | Sequence");

  const [
    // flows,
    flowKey,
    players,
    tool,
    zoom,
    snap_duration,
  ] = useStore((s) => {
    const flowKey = s.ui.flow_key;
    const flow_players = s.score.flows.by_key[flowKey].players;
    return [
      // s.score.flows.order.map((flow_key) => {
      //     const { key, title } = s.score.flows.by_key[flow_key];
      //     return { key, title };
      // }),
      flowKey,
      s.score.players.order
        .filter((playerKey) => flow_players[playerKey])
        .map((player_key) => s.score.players.by_key[player_key]),
      s.ui.play.tool,
      s.ui.play.zoom,
      s.ui.snap,
    ];
  });

  const counts = useCounts();
  const ticks = useTicks();
  const colors = useRainbow(players.length);

  useHotkeys("1", () => actions.ui.play.tool(Tool.Select));
  useHotkeys("2", () => actions.ui.play.tool(Tool.Draw));
  useHotkeys("3", () => actions.ui.play.tool(Tool.Slice));
  useHotkeys("4", () => actions.ui.play.tool(Tool.Erase));

  const inc = useCallback(() => {
    if (zoom + 0.05 <= 5) {
      actions.ui.play.zoom(zoom + 0.05);
    }
  }, [zoom]);

  const desc = useCallback(() => {
    if (zoom - 0.05 >= 0.25) {
      actions.ui.play.zoom(zoom - 0.05);
    }
  }, [zoom]);

  return (
    <>
      {/* <div className="play__top-panel">
                <div className="play__flow-selector">
                    <Select value={flowKey} onChange={actions.ui.flow_key}>
                        {flows.map((flow, i) => {
                            const title = `${i + 1}. ${flow.title || "Untitled Flow"}`;
                            return (
                                <Option key={flow.key} value={flow.key} displayAs={title}>
                                    {title}
                                </Option>
                            );
                        })}
                    </Select>
                </div>
                
            </div> */}

      <DragScroll className="play__content" x ignore="no-scroll">
        <div className="play__left-panel no-scroll">
          <div className="play__tools">
            <Icon
              className="play__tool"
              toggled={tool === Tool.Select}
              onClick={() => actions.ui.play.tool(Tool.Select)}
              path={mdiCursorDefault}
              size={24}
            />
            <Icon
              className="play__tool"
              toggled={tool === Tool.Draw}
              onClick={() => actions.ui.play.tool(Tool.Draw)}
              path={mdiPen}
              size={24}
            />
            <Icon
              className="play__tool"
              toggled={tool === Tool.Slice}
              onClick={() => actions.ui.play.tool(Tool.Slice)}
              path={mdiBoxCutter}
              size={24}
            />
            <Icon
              className="play__tool"
              toggled={tool === Tool.Erase}
              onClick={() => actions.ui.play.tool(Tool.Erase)}
              path={mdiEraser}
              size={24}
            />
          </div>
          {players.map((player, i) => {
            return player.instruments.map((instrument_key) => {
              return (
                <Controls
                  key={instrument_key}
                  count={counts[instrument_key]}
                  instrumentKey={instrument_key}
                  color={colors[i]}
                  playerType={player.type}
                />
              );
            });
          })}
        </div>

        <div className="play__right-panel">
          <div className="play__right-panel-content">
            <PlayHead ticks={ticks} zoom={zoom} />
            <div className="play__ticks">
              <Ticks isTrack={false} ticks={ticks} height={48} className="play__tick-track" zoom={zoom} />
            </div>
            {players.map((player, i) => {
              return player.instruments.map((instrument_key) => {
                return (
                  <Track
                    key={instrument_key}
                    instrumentKey={instrument_key}
                    flowKey={flowKey}
                    color={colors[i]}
                    ticks={ticks}
                    zoom={zoom}
                  />
                );
              });
            })}
          </div>
        </div>
      </DragScroll>

      <div className="play__bottom-panel">
        <div className="play__bottom-panel-section">
          <Select
            className="play__bottom-panel-select play__snap-select"
            direction="up"
            value={snap_duration}
            onChange={(val) => actions.ui.snap(val)}
          >
            <Option value={NoteDuration.Eighth} displayAs={"\u{E1D7}"}>
              {"\u{E1D7}"}
            </Option>
            <Option value={NoteDuration.Sixteenth} displayAs={"\u{E1D9}"}>
              {"\u{E1D9}"}
            </Option>
            <Option value={NoteDuration.ThirtySecond} displayAs={"\u{E1DB}"}>
              {"\u{E1DB}"}
            </Option>
          </Select>
        </div>
        <div />
        <div className="play__bottom-panel-section">
          <Icon className="play__bottom-panel-icon" path={mdiMinus} size={22} onClick={desc} />
          <Select
            className="play__bottom-panel-select play__zoom-select"
            direction="up"
            value={Math.round(zoom * 100)}
            onChange={(value) => actions.ui.play.zoom(value)}
          >
            {/* This is a bit weired but we need a fake option to hld the current,
                            possibly abartrary, zoom level. It is hidden with CSS */}
            <Option value={Math.round(zoom * 100)} displayAs={`${Math.round(zoom * 100)}%`} />
            <Option value={0.25} displayAs="25%">
              25%
            </Option>
            <Option value={0.5} displayAs="50%">
              50%
            </Option>
            <Option value={0.75} displayAs="75%">
              75%
            </Option>
            <Option value={1.0} displayAs="100%">
              100%
            </Option>
            <Option value={1.5} displayAs="150%">
              150%
            </Option>
            <Option value={2.0} displayAs="200%">
              200%
            </Option>
            <Option value={3.0} displayAs="300%">
              300%
            </Option>
            <Option value={4.0} displayAs="400%">
              400%
            </Option>
            <Option value={5.0} displayAs="500%">
              500%
            </Option>
          </Select>
          <Icon className="play__bottom-panel-icon" path={mdiPlus} size={22} onClick={inc} />
        </div>
      </div>
    </>
  );
};

export default Play;
