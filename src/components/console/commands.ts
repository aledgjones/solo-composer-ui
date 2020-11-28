import { actions } from "../../store/actions";
import { State } from "../../store/defs";
import {
  modeFromKey,
  offsetFromKey,
} from "../../store/entries/key-signature/defs";

export const commands = (state: State) => {
  const flowKey = state.ui.flow_key || state.score.flows.order[0];
  return {
    help: {
      description: "Show commands",
      fn: async () => {
        const out: string[] = Object.entries(commands(state)).map(
          ([key, value]) => {
            return `${key.padEnd(15, " ")} ${value.description}`;
          }
        );
        return "\n" + out.join("\n") + "\n\n";
      },
    },
    subdivisions: {
      description: "Get flow subdivisions",
      fn: async () => {
        return state.score.flows.by_key[flowKey].subdivisions;
      },
    },
    "flow-length": {
      description: "Get/Set flow length",
      fn: async (length: string) => {
        if (length) {
          try {
            actions.score.flow.length(flowKey, parseInt(length));
          } catch (e) {
            return "Invalid args. Expect:\n\nflow-length {length: int}";
          }
        } else {
          return state.score.flows.by_key[flowKey].length;
        }
      },
    },
    key: {
      description: "Set the key",
      fn: async (tick: string, key: string) => {
        const error =
          "Invalid args.\n\nExpected: key {tick: int} {key: int}\nExample usage: key 0 Ab";
        if (tick && parseInt(tick) >= 0 && key) {
          const offset = offsetFromKey(key);
          const mode = modeFromKey(key);
          if (offset !== null) {
            try {
              actions.score.entries.key_signature.create(
                flowKey,
                parseInt(tick),
                mode,
                offset
              );
            } catch (e) {
              return error;
            }
          }
        } else {
          return error;
        }
      },
    },
    debug: {
      description: "Toggle debug highlights",
      fn: async () => {
        actions.developer.debug.toggle();
      },
    },
  };
};
