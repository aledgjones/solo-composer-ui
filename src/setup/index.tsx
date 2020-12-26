import { FC, useState, useCallback } from "react";
import { useTitle } from "../../ui";
import { FlowList } from "./flow-list";
import { LayoutList } from "./layout-list";
import { RenderRegion } from "../components/render-region";
import { PlayerList } from "./player-list";
import { Selection, SelectionType } from "./selection";
import { PlayerTypePicker } from "../dialogs/player-type-picker";
import { InstrumentPicker } from "../dialogs/instrument-picker";
import { Renderer } from "../components/renderer";
import { actions } from "../store/actions";
import { PlayerType } from "../store/score-player/defs";

import "./styles.css";

const Setup: FC = () => {
  useTitle("Solo Composer | Setup");

  // local selection is good -- we don't need to keep on nav.
  const [selection, setSelection] = useState<Selection>(null);

  const [typePicker, setTypePicker] = useState<(player_type: PlayerType) => void>(null);
  const [instrumentPicker, setInstrumentPicker] = useState<(id: string) => void>(null);

  /**
   * Async conductor for selecting and assigning an instrument to player
   */
  const onAddInstrument = useCallback((playerKey: string, player_type: PlayerType) => {
    const run = async () => {
      const instrument_id = await new Promise<string>((resolve) => {
        setInstrumentPicker(() => {
          return resolve;
        });
      });
      setInstrumentPicker(null);
      const instrumentKey = actions.score.instrument.create(instrument_id);
      actions.score.player.assign_instrument(playerKey, instrumentKey);
      actions.playback.sampler.load(instrument_id, instrumentKey, player_type);
      setInstrumentPicker(null);
    };
    run();
  }, []);

  /**
   * Async conductor for selecting player type
   */
  const onAddPlayer = useCallback(() => {
    const run = async () => {
      const player_type = await new Promise<PlayerType>((resolve) => {
        setTypePicker(() => {
          return resolve;
        });
      });
      setTypePicker(null);
      const player_key = actions.score.player.create(player_type);
      setSelection({ key: player_key, type: SelectionType.Player });
      onAddInstrument(player_key, player_type);
    };
    run();
  }, [onAddInstrument]);

  return (
    <>
      <div className="setup">
        <PlayerList
          selection={selection}
          onSelect={setSelection}
          onAddInstrument={onAddInstrument}
          onCreatePlayer={onAddPlayer}
        />

        <div className="setup__middle">
          <RenderRegion className="setup__view">
            <Renderer />
          </RenderRegion>
          <FlowList selection={selection} onSelect={setSelection} />
        </div>
        <LayoutList />
      </div>

      <PlayerTypePicker width={400} open={!!typePicker} onSelect={typePicker} onCancel={() => setTypePicker(null)} />
      <InstrumentPicker
        width={1200}
        open={!!instrumentPicker}
        onSelect={instrumentPicker}
        onCancel={() => setInstrumentPicker(null)}
      />
    </>
  );
};

export default Setup;
