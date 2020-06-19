import React, { FC, useState, useCallback } from "react";
import { useTitle, Icon } from "../../ui";
import { actions, PlayerType } from "../../store";
import { SetupSettings } from "../dialogs/setup-settings";
import { FlowList } from "./flow-list";
import { LayoutList } from "./layout-list";
import { RenderRegion } from "../components/render-region";
import { PlayerList } from "./player-list";
import { Selection, SelectionType } from "./selection";
import { PlayerTypePicker } from "../dialogs/player-type-picker";
import { InstrumentPicker } from "../dialogs/instrument-picker";

import "./styles.css";

const Setup: FC = () => {
    useTitle("Solo Composer | Setup");

    // local selection is good -- we don't need to keep on nav.
    const [selection, setSelection] = useState<Selection>(null);
    const [typePicker, setTypePicker] = useState<boolean>(false);
    const [instrumentPicker, setInstrumentPicker] = useState<boolean>(false);

    const onTypeSelected = useCallback(
        (type: PlayerType) => {
            setTypePicker(false);
            const player_key = actions.score.player.create(type);
            setSelection({ key: player_key, type: SelectionType.Player });
            setInstrumentPicker(true);
        },
        [actions.score.player]
    );

    const onSelectInstrument = useCallback(
        (id: string) => {
            if (selection) {
                // const channel = actions.playback.sampler.createChannel();
                const instrument = actions.score.instrument.create(id);

                actions.score.player.assign_instrument(selection.key, instrument.key);
                // actions.playback.sampler.assignInstrument(instrument.key, channel);
                // actions.playback.sampler.load(channel, def);
            }
            setInstrumentPicker(false);
        },
        [selection, actions.score.instrument, actions.score.player, actions.sampler]
    );

    return (
        <>
            <div className="setup">
                <PlayerList
                    selection={selection}
                    onSelect={setSelection}
                    onAddInstrument={() => setInstrumentPicker(true)} // <== TO DO
                    onCreatePlayer={() => setTypePicker(true)}
                />

                <div className="setup__middle">
                    <RenderRegion className="setup__view">{/* <RenderWriteMode /> */}</RenderRegion>
                    <FlowList selection={selection} onSelect={setSelection} />
                </div>
                <LayoutList />
            </div>

            <PlayerTypePicker
                width={400}
                open={typePicker}
                onCancel={() => setTypePicker(false)}
                onSelect={onTypeSelected}
            />
            <InstrumentPicker
                width={900}
                open={instrumentPicker}
                onSelect={onSelectInstrument}
                onCancel={() => setInstrumentPicker(false)}
            />
        </>
    );
};

export default Setup;
