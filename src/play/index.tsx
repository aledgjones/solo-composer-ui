import React, { FC, useState } from "react";
import { mdiCursorDefault, mdiEraser, mdiCogOutline, mdiPen, mdiBoxCutter } from "@mdi/js";
import { useTitle, useRainbow, Icon, DragScroll, Select, Option } from "../../ui";
import { useStore, useCounts, actions, PlayTool } from "../../store";
import { Keyboard } from "./keyboard";

import "./styles.css";

const Play: FC = () => {
    useTitle("Solo Composer | Play");

    const [flows, players, instruments, expanded, tool] = useStore((s) => [
        s.score.flows.order.map((flow_key) => s.score.flows.by_key[flow_key]),
        s.score.players.order.map((player_key) => s.score.players.by_key[player_key]),
        s.score.instruments,
        s.ui.expanded,
        s.ui.play_tool
    ]);

    const [zoom] = useState<number>(1); // horizontal
    const [settings, setSettings] = useState(false);

    const [flowKey, setFlowKey] = useState(flows[0].key);

    const colors = useRainbow(players.length);
    const counts = useCounts(players, instruments);

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
                <Icon className="play__tool" path={mdiCogOutline} size={24} onClick={() => setSettings(true)} />
            </div>

            <DragScroll className="play__content" x ignore="no-scroll">
                <div className="play__left-panel no-scroll">
                    <Keyboard instrumentKey="foo" />
                    <Keyboard instrumentKey="bar" />
                </div>
            </DragScroll>

            <div className="play__bottom-panel"></div>
        </>
    );
};

export default Play;
