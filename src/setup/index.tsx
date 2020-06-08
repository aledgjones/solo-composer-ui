import React, { FC, useState } from "react";
import { mdiCogOutline } from "@mdi/js";
import { useTitle, Icon } from "../ui";
import { useActions, PlayerType } from "../use-store";
import { Panel } from "../components/panel";
import { SetupSettings } from "../dialogs/setup-settings";
import { FlowList } from "./flow-list";
import { Selection } from "./selection";

import "./styles.css";

const Setup: FC = () => {
    const actions = useActions();
    useTitle("Solo Composer | Setup");

    // local selection is good -- we don't need to keep on nav.
    const [selection, setSelection] = useState<Selection>(null);
    const [typeSelector, setTypeSelector] = useState<boolean>(false);
    const [instrumentSelector, setInstrumentSelector] = useState<boolean>(false);
    const [settings, setSettings] = useState<boolean>(false);

    return (
        <>
            <Panel>
                <div className="panel__wrapper" />
                <div className="panel__wrapper panel__wrapper--settings">
                    <Icon
                        className="panel__tool"
                        path={mdiCogOutline}
                        size={24}
                        onClick={() => setSettings(true)}
                    />
                </div>
            </Panel>

            <div className="setup__content">
                <FlowList selection={selection} onSelect={setSelection} />
            </div>

            <SetupSettings width={900} open={settings} onClose={() => setSettings(false)} />
        </>
    );

    // const onTypeSelected = useCallback(
    //     (type?: PlayerType) => {
    //         setTypeSelector(false);
    //         if (type) {
    //             const playerKey = actions.score.players.create(type);
    //             setSelection({ key: playerKey, type: SelectionType.player });
    //             setInstrumentSelector(true);
    //         }
    //     },
    //     [actions.score.players]
    // );

    // const onAddInstrument = useCallback(() => {
    //     setInstrumentSelector(true);
    // }, []);

    // const onSelectInstrument = useCallback(
    //     (def: InstrumentDef) => {
    //         if (selection) {
    //             const channel = actions.playback.sampler.createChannel();
    //             const instrument = actions.score.instruments.create(def);

    //             actions.score.players.assignInstrument(selection.key, instrument.key);
    //             actions.playback.sampler.assignInstrument(instrument.key, channel);
    //             actions.playback.sampler.load(channel, def);
    //         }
    //         setInstrumentSelector(false);
    //     },
    //     [selection, actions.score.instruments, actions.score.players, actions.playback.sampler]
    // );

    // return (
    //     <>
    //         <Panel>
    //             <div className="panel__wrapper" />
    //             <div className="panel__wrapper panel__wrapper--settings">
    //                 <Icon
    //                     className="panel__tool"
    //                     path={mdiCogOutline}
    //                     size={24}
    //                     color={theme.background[400].fg}
    //                     onClick={() => setSettings(true)}
    //                 />
    //             </div>
    //         </Panel>

    //         <div className="setup" style={{ backgroundColor: theme.background[500].bg }}>
    //             <PlayerList
    //                 selection={selection}
    //                 onSelect={setSelection}
    //                 onCreatePlayer={() => setTypeSelector(true)}
    //                 onAddInstrument={onAddInstrument}
    //             />
    //             <div
    //                 className="setup__middle"
    //                 style={{
    //                     borderRight: `solid 4px ${theme.background[400].bg}`,
    //                     borderLeft: `solid 4px ${theme.background[400].bg}`
    //                 }}
    //             >
    //                 <RenderRegion className="setup__view">
    //                     <RenderWriteMode />
    //                 </RenderRegion>
    //                 <FlowList selection={selection} onSelect={setSelection} />
    //             </div>
    //             <LayoutList />
    //         </div>

    //         <PlayerTypeSelector width={400} open={typeSelector} onClose={onTypeSelected} />
    //         <InstrumentSelector
    //             width={900}
    //             open={instrumentSelector}
    //             onSelect={onSelectInstrument}
    //             onCancel={() => setInstrumentSelector(false)}
    //         />
    //         <SetupSettings width={900} open={settings} onClose={() => setSettings(false)} />
    //     </>
    // );
};

export default Setup;
