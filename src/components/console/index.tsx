import React, { FC, useState } from "react";
import ReactConsole from "@webscopeio/react-console";
import pkg from "../../../package.json";
import { Window } from "../../../ui";
import { useStore } from "../../store/use-store";
import { commands } from "./commands";
import { getStorage, setStorage } from "../../store/utils";

export const Console: FC = () => {
  const state = useStore((s) => s);
  const [history, setHistory] = useState<string[]>(
    () => getStorage("@sc:terminal-history/v1") || []
  );

  if (!state.developer.terminal.show) {
    return null;
  }

  const styles = `
        * {
            box-sizing: border-box;
            margin: 0;
        }

        .styles_wrapper__3KXDn {
          display: flex;
          flex-direction: column;
          background-color: black;
          color: white;
          font-family: monospace;
          font-size: 12px;
          padding: 10px;
          min-height: 100vh;
        }

        .styles_promptWrapper__2Cy1Y {
          display: flex;
        }

        .styles_line__1lhnu {
          font-size: 12px;
          line-height: 12px;
          font-family: monospace;
          background: transparent !important; /* we want to make this transparent whatever happens in the app*/
          padding: 0;
          color: white;
        }

        .styles_prompt__1nRph {
          display: flex;
          align-items: center;
          line-height: 12px;
          margin-top: -2px;
        }

        .styles_input__15JGo {
          flex: 1;
          background: transparent !important; /* we want to make this transparent whatever happens in the app*/
          border: none;
          outline: none;
          color: white;
          font-family: monospace;
          font-size: 12px;
          padding: 0;
          margin-top: -2px;
        }
      `;

  return (
    <Window styles={styles}>
      <ReactConsole
        history={history}
        onAddHistoryItem={(item) => {
          setHistory([...history, item]);
          setStorage("@sc:terminal-history/v1", [...history, item].slice(-10));
        }}
        welcomeMessage={`Solo Composer ${pkg.version}\n\n`}
        commands={commands(state)}
      />
    </Window>
  );
};
