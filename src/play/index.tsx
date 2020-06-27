import React, { FC, useState } from "react";
import { mdiCursorDefault, mdiEraser, mdiPen, mdiBoxCutter } from "@mdi/js";
import { useTitle, useRainbow, Icon, DragScroll, Select, Option } from "../../ui";
import { useStore, useCounts, actions, PlayTool, useTicks } from "../../store";
import { Controls } from "./controls";
import { Track } from "./track";

import "./styles.css";

const Play: FC = () => {
    useTitle("Solo Composer | Play");

    const [flows, players, instruments, expanded, tool] = useStore((s) => {
        return [
            s.score.flows.order.map((flow_key) => {
                const { key, title } = s.score.flows.by_key[flow_key];
                return { key, title };
            }),
            s.score.players.order.map((player_key) => s.score.players.by_key[player_key]),
            s.score.instruments,
            s.ui.expanded,
            s.ui.play_tool
        ];
    });

    const [zoom] = useState<number>(1); // horizontal
    const [flowKey, setFlowKey] = useState<string>(flows[0].key);
    const flow = useStore((s) => s.score.flows.by_key[flowKey], [flowKey]);

    const colors = useRainbow(players.length);
    const counts = useCounts(players, instruments);
    const ticks = useTicks(flow, zoom);

    return (
        <>
            <div className="play__top-panel">
                <div className="play__flow-selector">
                    <Select value={flowKey} onChange={setFlowKey}>
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
                <div className="play__tools">
                    <Icon
                        className="play__tool"
                        toggled={tool === PlayTool.Select}
                        onClick={() => actions.ui.tool.play(PlayTool.Select)}
                        path={mdiCursorDefault}
                        size={24}
                    />
                    <Icon
                        className="play__tool"
                        toggled={tool === PlayTool.Draw}
                        onClick={() => actions.ui.tool.play(PlayTool.Draw)}
                        path={mdiPen}
                        size={24}
                    />
                    <Icon
                        className="play__tool"
                        toggled={tool === PlayTool.Slice}
                        onClick={() => actions.ui.tool.play(PlayTool.Slice)}
                        path={mdiBoxCutter}
                        size={24}
                    />
                    <Icon
                        className="play__tool"
                        toggled={tool === PlayTool.Erase}
                        onClick={() => actions.ui.tool.play(PlayTool.Erase)}
                        path={mdiEraser}
                        size={24}
                    />
                </div>
            </div>

            <DragScroll className="play__content" x ignore="no-scroll">
                <div className="play__left-panel no-scroll">
                    {players.map((player, i) => {
                        if (flow.players.includes(player.key)) {
                            return player.instruments.map((instrument_key) => {
                                return (
                                    <Controls
                                        key={instrument_key}
                                        color={colors[i]}
                                        playerType={player.player_type}
                                        instrument={instruments[instrument_key]}
                                        expanded={expanded[instrument_key + "-instrument"]}
                                        count={counts[instrument_key]}
                                    />
                                );
                            });
                        } else {
                            return null;
                        }
                    })}
                </div>

                <div className="play__right-panel">
                    {players.map((player, i) => {
                        if (flow.players.includes(player.key)) {
                            return player.instruments.map((instrument_key) => {
                                return (
                                    <Track
                                        key={instrument_key}
                                        ticks={ticks}
                                        instrument={instruments[instrument_key]}
                                        expanded={expanded[instrument_key + "-instrument"]}
                                    />
                                );
                            });
                        } else {
                            return null;
                        }
                    })}
                </div>
            </DragScroll>

            <div className="play__bottom-panel"></div>
        </>
    );
};

export default Play;
