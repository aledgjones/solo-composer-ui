import React, { FC, useState, useMemo, useEffect } from "react";
import { mdiCursorDefault, mdiEraser, mdiCogOutline, mdiPen, mdiBoxCutter } from "@mdi/js";
import { useTitle, useRainbow, Icon } from "../ui";
import { useStore, useCounts, actions } from "../../store";

import "./styles.css";
import { Panel } from "../components/panel";
import { PlayTool } from "solo-composer-engine";

const Play: FC = () => {
    useTitle("Solo Composer | Play");

    const [players, instruments, expanded, tool] = useStore((s) => [
        s.score.players.order.map((player_key) => s.score.players.by_key[player_key]),
        s.score.instruments,
        s.ui.expanded,
        s.ui.play_tool
    ]);

    const [zoom] = useState<number>(1);
    const [settings, setSettings] = useState(false);

    // const [flowKey, setFlowKey] = useState(score.flows.order[0]);
    // const flow = score.flows.by_key[flowKey];
    // const flowEntriesByTick = useMemo(
    //     () => entriesByTick(flow.master.entries.order, flow.master.entries.byKey),
    //     [flow.master.entries]
    // );

    const colors = useRainbow(players.length);
    const counts = useCounts(players, instruments);
    // const ticks = useTicks(flow.subdivisions, flow.length, flowEntriesByTick, zoom);

    // deal with selection
    // useEffect(() => {
    //     const callback = (e: any) => {
    //         const target = e.target as HTMLElement;
    //         if (tool === Tool.select && target.classList.contains("instrument-track")) {
    //             actions.ui.selection[TabState.play].clear();
    //         }
    //     };
    //     window.addEventListener("pointerdown", callback);

    //     return () => {
    //         window.removeEventListener("pointerdown", callback);
    //     };
    // }, [tool, actions.ui.selection]);

    return (
        <>
            <Panel>
                <div className="panel__wrapper">
                    <Icon
                        className="panel__tool"
                        toggled={tool === PlayTool.Select}
                        onClick={() => actions.ui.tool.play(PlayTool.Select)}
                        path={mdiCursorDefault}
                        size={24}
                    />
                    <Icon
                        className="panel__tool"
                        toggled={tool === PlayTool.Draw}
                        onClick={() => actions.ui.tool.play(PlayTool.Draw)}
                        path={mdiPen}
                        size={24}
                    />
                    <Icon
                        className="panel__tool"
                        toggled={tool === PlayTool.Slice}
                        onClick={() => actions.ui.tool.play(PlayTool.Slice)}
                        path={mdiBoxCutter}
                        size={24}
                    />
                    <Icon
                        className="panel__tool"
                        toggled={tool === PlayTool.Erase}
                        onClick={() => actions.ui.tool.play(PlayTool.Erase)}
                        path={mdiEraser}
                        size={24}
                    />
                </div>
                <div className="panel__wrapper panel__wrapper--settings">
                    <Icon
                        className="panel__tool"
                        path={mdiCogOutline}
                        size={24}
                        onClick={() => setSettings(true)}
                    />
                </div>
            </Panel>

            {/* <DragScroll className="play" x ignore="no-scroll">
                <div className="play__x-fixed play__left-panel no-scroll">
                    <div
                        className="play__controls"
                        style={{ backgroundColor: theme.background[500].bg }}
                    >
                        <div
                            className="play__header-select"
                            style={{ backgroundColor: theme.background[400].bg }}
                        >
                            <Select
                                className="play__select"
                                label=""
                                color={theme.background[500].fg}
                                value={flowKey}
                                onChange={setFlowKey}
                                style={{ color: theme.background[500].fg }}
                            >
                                {score.flows.order.map((key) => {
                                    const title = score.flows.byKey[key].title;
                                    return (
                                        <Option key={key} value={key} displayAs={title}>
                                            {title}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </div>
                        <div className="play__player-controls">
                            {score.players.order.map((playerKey, i) => {
                                if (flow.players.includes(playerKey)) {
                                    const player = score.players.byKey[playerKey];
                                    return (
                                        <PlayerControls
                                            key={playerKey}
                                            color={colors[i]}
                                            expanded={expanded[playerKey + "-play"]}
                                            player={player}
                                            instruments={score.instruments}
                                            counts={counts}
                                            onToggleExpand={actions.ui.expanded.toggle}
                                        />
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </div>
                    </div>
                </div>

                <div
                    className="play__scrollable"
                    style={{ backgroundColor: theme.background[500].bg }}
                >
                    <Ticks
                        className="play__ticks"
                        color={theme.background[800].bg}
                        highlight={theme.background[800].bg}
                        fixed={false}
                        ticks={ticks}
                        height={48}
                        style={{ backgroundColor: theme.background[400].bg }}
                    />
                    <div className="play__track-area">
                        {score.players.order.map((playerKey, i) => {
                            if (flow.players.includes(playerKey)) {
                                const player = score.players.byKey[playerKey];
                                return (
                                    <PlayerTrack
                                        key={playerKey}
                                        flowKey={flowKey}
                                        color={colors[i]}
                                        expanded={expanded[playerKey + "-play"]}
                                        player={player}
                                        instruments={score.instruments}
                                        staves={flow.staves}
                                        tracks={flow.tracks}
                                        ticks={ticks}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })}
                    </div>
                </div>
            </DragScroll> */}

            {/* <PlaySettings open={settings} width={900} onClose={() => setSettings(false)} /> */}
        </>
    );
};

export default Play;
