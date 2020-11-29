import { actions } from "../../store/actions";
import { State } from "../../store/defs";
import {
  modeFromKey,
  offsetFromKey,
} from "../../store/entries/key-signature/defs";

type Commands = (
  state: any
) => {
  [term: string]: {
    description: string;
    help: string;
    fn: (...args: string[]) => any;
  };
};

export const commands: Commands = (state: State) => {
  const flowKey = state.ui.flow_key || state.score.flows.order[0];
  return {
    help: {
      description: "Show information about available commands",
      help: `
USAGE:
help {term?: string}

`,
      fn: (term: string) => {
        const actions = commands(state);
        if (term) {
          const action = actions[term];
          if (action) {
            return `${action.help}`;
          } else {
            return `Command ${term} does not exist`;
          }
        } else {
          const out: string[] = Object.entries(actions).map(([key, value]) => {
            return `${key.padEnd(15, " ")} ${value.description}`;
          });
          return "\n" + out.join("\n") + "\n\n";
        }
      },
    },
    subdivisions: {
      description: "Get flow subdivisions",
      help: `
Returns the number of subdivisions per quarter beat (irrespective of time signature)

USAGE:
subdivisions

`,
      fn: () => {
        return state.score.flows.by_key[flowKey].subdivisions;
      },
    },
    "flow-length": {
      description: "Get/Set flow length",
      help: `
If no arg supplies, this command returns the number of ticks in the whole flow else it sets the length

USAGE:
flow-length {length?: number}

`,
      fn: (length: string) => {
        if (length) {
          try {
            actions.score.flow.length(flowKey, parseInt(length));
          } catch (e) {
            return "Invalid args provided";
          }
        } else {
          return state.score.flows.by_key[flowKey].length;
        }
      },
    },
    key: {
      description: "Set the key at a specific tick",
      help: `
Sets the key signature at a specific tick in the current flow

USAGE:
key {tick: number} {key: string}

`,
      fn: async (tick: string, key: string) => {
        const error = `Invalid args provided`;
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
      help: "",
      fn: async () => {
        actions.developer.debug.toggle();
      },
    },
  };
};
