import React, { FC } from "react";
import { PlayerType } from "solo-composer-parser";
import { useTitle } from "../ui";
import { useActions } from "../use-store";

import "./styles.css";

const Setup: FC = () => {
    const actions = useActions();
    useTitle("Solo Composer | Setup");

    return (
        <>
            <button onClick={() => actions.score.player.create(PlayerType.Solo)}>Create Player</button>
            <button
                onClick={() => {
                    const playerKey = actions.score.player.create(PlayerType.Solo);
                    const { key: instrumentKey, patches } = actions.score.instrument.create("strings.violin");
                    console.log(instrumentKey, patches);
                    actions.score.player.assign_instrument(playerKey, instrumentKey);
                }}
            >
                Create PLayer / Instrument
            </button>
        </>
    );

    // // local selection fine, we don't need to keep this after nav.
    // const [selection, setSelection] = useState<Selection>(null);
    // const [typeSelector, setTypeSelector] = useState<boolean>(false);
    // const [instrumentSelector, setInstrumentSelector] = useState<boolean>(false);
    // const [settings, setSettings] = useState<boolean>(false);

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
